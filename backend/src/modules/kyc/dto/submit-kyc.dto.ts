import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsString,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';

export class KycDocumentDto {
  @IsString()
  @IsNotEmpty()
  documentType: string; // one of KYC_REQUIRED_DOCS

  @IsString()
  @IsNotEmpty()
  filePublicId: string;

  @IsString()
  @IsNotEmpty()
  fileUrl: string;
}

export class SubmitKycDto {
  @IsArray()
  @ArrayMinSize(4)
  @ValidateNested({ each: true })
  @Type(() => KycDocumentDto)
  documents: KycDocumentDto[];
}
