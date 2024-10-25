import { CreateStudentProfileDto } from '../dto/create-student-profile.dto';
import { Student } from '../entitles/student-profile.entity';
import { UpdateStudentProfileDto } from '../dto/update-student-profile.dto';

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
}
