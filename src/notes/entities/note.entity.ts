import { v4 as uuidv4 } from 'uuid';

export class Note {
  noteId: string;
  title: string;
  createdAt: Date;
  updatedAt?: Date;

  static newInstanceFromCreateNoteDto(createNoteDto: any): Note {
    const note = new Note();
    note.noteId = uuidv4();
    note.title = createNoteDto.title;
    note.createdAt = new Date();

    return note;
  }

  static newInstanceFromDynamoDBObject(obj: any): Note {
    const note = new Note();
    note.noteId = obj.noteId.S;
    note.title = obj.title.S;
    note.createdAt = new Date(obj.createdAt.N);

    if (obj.createdAt) {
      note.updatedAt = obj.updatedAt ? new Date(obj.updatedAt.N) : undefined;
    }

    return note;
  }
}
