import type { Metadata } from "next";
import { ComparisonBlogPost } from "@/components/blog/ComparisonBlogPost";
import { otpVerificationFormBuilderComparison } from "@/lib/comparison-blog/otp-verification-form-builder-comparison";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: otpVerificationFormBuilderComparison.metaTitle,
  description: otpVerificationFormBuilderComparison.metaDescription,
  path: `/blog/${otpVerificationFormBuilderComparison.slug}`,
});

export default function OtpVerificationFormBuilderComparisonPage() {
  return <ComparisonBlogPost data={otpVerificationFormBuilderComparison} />;
}
