import { Injectable, NotFoundException, Query, ValidationPipe } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import * as uuid from 'uuid/v1';
import { CreateTaskDto } from './dto/create-task-dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(getTasksFilterDto: GetTasksFilterDto): Task[] {
    let result = this.tasks;
    if (getTasksFilterDto.search) {
      result = this.tasks.filter(task => task.description.toUpperCase().includes(getTasksFilterDto.search.toUpperCase()));
    }

    if (getTasksFilterDto.status) {
      result = this.tasks.filter(task => task.status === getTasksFilterDto.status);
    }

    return result;
  }

  getTaskById(id: string): Task {
    const found =  this.tasks.find(task => task.id === id);

    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return found;
  }

  deleteTask(id: string): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const {title, description} = createTaskDto;
    const task: Task = {
      title,
      description,
      status: TaskStatus.OPEN,
      id: uuid(),
    };

    this.tasks.push(task);

    return task;
  }

  updateTaskStatus(id: string, status: TaskStatus) {
    const task = this.getTaskById(id);

    task.status = status;
    return task;
  }
}
