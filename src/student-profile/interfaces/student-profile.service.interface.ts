import { CreateStudentProfileDto } from '../dto/create-student-profile.dto';
import { Student } from '../entitles/student-profile.entity';
import { UpdateStudentProfileDto } from '../dto/update-student-profile.dto';
import { StudentDeleteResponseInterface } from './student-delete-response.interface';

export interface StudentProfileServiceInterface {
  createStudentProfile(
    userId: number,
    createStudentProfileDto: CreateStudentProfileDto,
  ): Promise<Student>;

  updateStudentProfile(
    userId: number,
    studentId: string,
    updateStudentProfileDto: UpdateStudentProfileDto,
  ): Promise<Student>;

  getStudentProfiles(userId: number): Promise<Student[]>;

  getStudentProfile(userId: number, studentId: string): Promise<Student>;

  deleteStudentProfile(
    userId: number,
    studentId: string,
  ): Promise<StudentDeleteResponseInterface>;
}
