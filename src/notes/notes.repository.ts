import { Injectable } from '@nestjs/common';
import {
  AttributeValue,
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb';
import { Note } from 'src/notes/entities/note.entity';
import { title } from 'process';
import { create } from 'domain';

@Injectable()
export class NotesRepository {
  private readonly tableName = 'notes';
  private readonly client: DynamoDBClient;

  constructor() {
    this.client = new DynamoDBClient({ region: 'ap-southeast-1' });
  }

  async findAll() {
    const result: Note[] = [];

    const command = new ScanCommand({
      TableName: this.tableName,
    });

    const response = await this.client.send(command);

    if (response.Items) {
      response.Items.forEach((item) => {
        result.push(Note.newInstanceFromDynamoDBObject(item));
      });
    }

    return result;
  }

  async findOne(noteId: string) {
    const command = new GetItemCommand({
      TableName: this.tableName,
      Key: {
        noteId: { S: noteId },
      },
    });

    const response = await this.client.send(command);

    if (response.Item) {
      return Note.newInstanceFromDynamoDBObject(response.Item);
    }

    return null;
  }

  async upsertOne(note: Note) {
    const input: Record<string, AttributeValue> = {
      noteId: { S: note.noteId },
      title: { S: note.title },
      createdAt: { N: note.createdAt.getTime().toString() },
    };

    if (note.title) {
      input.title = { S: note.title };
    }

    if (note.updatedAt) {
      input.updatedAt = { N: note.updatedAt.getTime().toString() };
    }

    const command = new PutItemCommand({
      TableName: this.tableName,
      Item: input,
    });

    await this.client.send(command);
  }

  async deleteItem(noteId: string) {
    const command = new DeleteItemCommand({
      TableName: this.tableName,
      Key: {
        noteId: { S: noteId },
      },
      ReturnConsumedCapacity: 'TOTAL',
      ReturnValues: 'ALL_OLD',
    });

    const result = await this.client.send(command);
    if (result.Attributes) {
      return true;
    }

    return false;
  }
}
