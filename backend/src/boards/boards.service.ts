import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import UpdateBoardPayload from '../interfaces/updateBoardPayload.interface';
import {
  BOARDS_NOT_FOUND,
  BOARD_NOT_FOUND,
  describeExceptions,
  EMAIL_DONT_MATCH,
  UPDATE_FAILED,
} from '../constants/httpExceptions';
import BoardEntity from './entity/board.entity';
import BoardDto from './dto/board.dto';
import { encrypt, compare } from '../utils/bcrypt';
import transformBoard from '../helper/transformBoard';

@Injectable()
export default class BoardsService {
  constructor(
    @InjectRepository(BoardEntity)
    private boardsRepository: Repository<BoardEntity>,
  ) {}

  async create(boardData: BoardDto) {
    if (boardData.password) {
      boardData.password = await encrypt(boardData.password);
    }
    const newBoard = this.boardsRepository.create(boardData);
    return this.boardsRepository.save(newBoard);
  }

  async getAllBoards(email: string) {
    const boards = await this.boardsRepository.find({
      where: {
        'createdBy.email': email,
      },
    });
    if (boards) return boards;
    throw new HttpException(
      describeExceptions(BOARDS_NOT_FOUND),
      HttpStatus.NOT_FOUND,
    );
  }

  async getBoardFromRepo(boardId: string) {
    const board = await this.boardsRepository.findOne(boardId);
    if (board) return board;
    throw new HttpException(
      describeExceptions(BOARD_NOT_FOUND),
      HttpStatus.NOT_FOUND,
    );
  }

  async getBoardAndCheckTheOwner(id: string, email: string) {
    const board = await this.getBoardFromRepo(id);
    if (email !== board.createdBy.email)
      throw new HttpException(
        describeExceptions(EMAIL_DONT_MATCH),
        HttpStatus.UNAUTHORIZED,
      );
    return board;
  }

  async updateTitle(id: string, email: string, title: string) {
    const board = await this.getBoardAndCheckTheOwner(id, email);
    const {
      raw: { result },
    } = await this.boardsRepository.update(id, { ...board, title });
    if (result.ok === 1) return board;
    throw new HttpException(
      describeExceptions(UPDATE_FAILED),
      HttpStatus.BAD_REQUEST,
    );
  }

  async getBoardWithPassword(id: string, password?: string) {
    const board = await this.getBoardFromRepo(id);
    if (!board.locked) return board;

    if (!password || !board.password)
      throw new HttpException("Can't unlock", HttpStatus.UNAUTHORIZED);

    const isPasswordMatched = await compare(password, board.password);
    if (isPasswordMatched) return board;

    return { locked: true };
  }

  async getBoardWithEmail(id: string, email: string) {
    const board = await this.getBoardFromRepo(id);
    if (!board.locked) return board;
    if (board.createdBy.email === email) return board;
    return { locked: true };
  }

  async updateLocked(
    locked: boolean,
    password: string | null,
    boardId: string,
    email: string,
  ): Promise<BoardEntity> {
    const board = await this.getBoardFromRepo(boardId);
    if (board.createdBy.email !== email) {
      throw new HttpException(
        describeExceptions(BOARD_NOT_FOUND),
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (locked === false) {
      password = null;
    }
    const hashedPw = password ? await encrypt(password) : undefined;
    await this.boardsRepository.update(boardId, {
      locked,
      password: hashedPw,
    });
    return this.getBoardFromRepo(boardId);
  }

  async updateBoardPatch(payload: UpdateBoardPayload) {
    const board = await this.getBoardFromRepo(payload.id);
    const newBoard = transformBoard(board, payload.changes);
    delete newBoard._id;
    const {
      raw: { result },
    } = await this.boardsRepository.update(payload.id, newBoard);
    return result.ok === 1;
  }

  async deleteBoard(id: string, email: string) {
    const board = await this.getBoardAndCheckTheOwner(id, email);
    if (board) {
      const {
        raw: { result },
      } = await this.boardsRepository.delete(id);
      if (result.ok === 1) {
        return HttpStatus.OK;
      }
    }
    throw new HttpException(
      describeExceptions(BOARD_NOT_FOUND),
      HttpStatus.NOT_FOUND,
    );
  }
}