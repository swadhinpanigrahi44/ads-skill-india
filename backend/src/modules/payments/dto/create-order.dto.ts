import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateOrderDto {
  // Exactly one of these must be provided.
  @IsOptional()
  @IsString()
  packageSlug?: string;

  @IsOptional()
  @IsString()
  partnerTierSlug?: string;

  // Idempotency key from the frontend: `${userId}:${slug}:${timestamp}`
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  idempotencyKey: string;
}
