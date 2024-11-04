import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NotesRepository } from 'src/notes/notes.repository';
import { Note } from 'src/notes/entities/note.entity';

@Injectable()
export class NotesService {
  constructor(private readonly notesRepository: NotesRepository) {}

  create(createNoteDto: CreateNoteDto) {
    return this.notesRepository.upsertOne(
      Note.newInstanceFromCreateNoteDto(createNoteDto),
    );
  }

  findAll() {
    return this.notesRepository.findAll();
  }

  findOne(noteId: string) {
    return this.notesRepository.findOne(noteId);
  }

  async update(noteId: string, updateNoteDto: UpdateNoteDto) {
    const existingNote = await this.notesRepository.findOne(noteId);

    if (updateNoteDto.title) {
      existingNote.title = updateNoteDto.title;
    }

    existingNote.updatedAt = new Date();

    return this.notesRepository.upsertOne(existingNote);
  }

  remove(id: string) {
    return this.notesRepository.deleteItem(id);
  }
}
