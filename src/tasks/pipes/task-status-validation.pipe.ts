import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../tasks.model';

@Injectable()
export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowesStatuses = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];

  transform(value: any, metadata: ArgumentMetadata) {
    value = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`${value} is not valid status`);
    }

    return value;
  }

  private isStatusValid(status: any): boolean {
    return this.allowesStatuses.includes(status);
  }
}
