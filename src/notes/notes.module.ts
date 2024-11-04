import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { NotesRepository } from 'src/notes/notes.repository';

@Module({
  controllers: [NotesController],
  providers: [NotesService, NotesRepository],
})
export class NotesModule {}
