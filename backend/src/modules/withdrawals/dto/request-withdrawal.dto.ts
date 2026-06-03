import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { MIN_WITHDRAWAL_PAISE } from '../../../common/constants';

export class RequestWithdrawalDto {
  @IsInt()
  @Min(MIN_WITHDRAWAL_PAISE, {
    message: `Minimum withdrawal is ${MIN_WITHDRAWAL_PAISE / 100} rupees`,
  })
  amount: number; // paise

  @IsIn(['UPI', 'BANK'])
  method: 'UPI' | 'BANK';

  @IsOptional()
  @IsString()
  upiId?: string;

  @IsOptional()
  @IsString()
  accountHolderName?: string;

  @IsOptional()
  @IsString()
  accountNumber?: string;

  @IsOptional()
  @IsString()
  ifscCode?: string;

  @IsOptional()
  @IsString()
  bankName?: string;
}
