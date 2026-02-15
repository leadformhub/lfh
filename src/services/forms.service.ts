import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { canCreateForm } from "@/lib/plans";
import type { UserPlan } from "@prisma/client";
import {
  type FormSchema,
  DEFAULT_FORM_SCHEMA,
  parseFormSchema,
  stringifyFormSchema,
} from "@/lib/form-schema";

export interface CreateFormInput {
  userId: string;
  name: string;
  /** Optional initial schema (fields + settings). If omitted, uses DEFAULT_FORM_SCHEMA. */
  schema?: FormSchema;
}

export async function createForm(input: CreateFormInput) {
  const user = await prisma.user.findUnique({ where: { id: input.userId } });
  if (!user) {
    throw new Error("Account not found. Please log out and sign in again, or sign up.");
  }
  const count = await prisma.form.count({ where: { userId: input.userId } });
  const plan = (user.plan ?? "free") as UserPlan;
  if (!canCreateForm(plan, count)) {
    throw new Error("Form limit reached for your plan. Please upgrade.");
  }

  const schema = input.schema ?? DEFAULT_FORM_SCHEMA;
  return prisma.form.create({
    data: {
      userId: input.userId,
      name: input.name,
      schemaJson: stringifyFormSchema(schema),
    },
  });
}

export async function getFormsByUserId(userId: string, page = 1, perPage = 25) {
  const skip = (page - 1) * perPage;
  const [forms, total] = await Promise.all([
    prisma.form.findMany({
      where: { userId },
      include: { _count: { select: { leads: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: perPage,
    }),
    prisma.form.count({ where: { userId } }),
  ]);
  return { forms, total, page, perPage };
}

/** Forms with parsed schema_json for leads table column definitions (fields from schema). */
export async function getFormsWithSchemaByUserId(userId: string, limit = 500) {
  const forms = await prisma.form.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return forms.map((f) => ({
    id: f.id,
    name: f.name,
    schemaJson: f.schemaJson,
    schema: parseFormSchema(f.schemaJson),
  }));
}

/** Cached 60s for leads page to avoid repeated form list fetches on nav/form switch. */
export const getFormsWithSchemaByUserIdCached = (userId: string, limit = 500) =>
  unstable_cache(
    () => getFormsWithSchemaByUserId(userId, limit),
    ["leads-forms", userId],
    { revalidate: 60 }
  )();

export async function getFormById(formId: string, userId?: string) {
  const form = await prisma.form.findUnique({
    where: { id: formId },
  });
  if (!form) return null;
  if (userId && form.userId !== userId) return null;
  return {
    ...form,
    schema: parseFormSchema(form.schemaJson),
  };
}

/** Returns form by id for public viewing. Includes owner plan for branding. */
export async function getFormByIdForPublic(formId: string) {
  const form = await prisma.form.findUnique({
    where: { id: formId },
    include: { user: { select: { plan: true } } },
  });
  if (!form) return null;
  return {
    ...form,
    schema: parseFormSchema(form.schemaJson),
  };
}

export async function updateForm(
  formId: string,
  userId: string,
  data: Partial<{ name: string }>
) {
  const form = await prisma.form.findFirst({ where: { id: formId, userId } });
  if (!form) return null;
  if (form.lockedAt) throw new Error("This form is locked. Upgrade to unlock.");
  return prisma.form.update({
    where: { id: formId },
    data,
  });
}

/** Save entire form schema JSON into forms.schema_json. No DB column mapping. */
export async function updateFormSchema(
  formId: string,
  userId: string,
  schema: FormSchema
) {
  const form = await prisma.form.findFirst({ where: { id: formId, userId } });
  if (!form) return null;
  if (form.lockedAt) throw new Error("This form is locked. Upgrade to unlock.");
  const schemaJson = stringifyFormSchema(schema);
  return prisma.form.update({
    where: { id: formId },
    data: { schemaJson },
  });
}

export async function deleteForm(formId: string, userId: string) {
  const form = await prisma.form.findFirst({ where: { id: formId, userId } });
  if (!form) return null;
  await prisma.form.delete({ where: { id: formId } });
  return true;
}
