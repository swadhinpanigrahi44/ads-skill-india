-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "twoFAOtpExpiresAt" TIMESTAMP(3),
ADD COLUMN     "twoFAOtpHash" TEXT;
