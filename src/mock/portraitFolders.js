import { uniqueId } from 'lodash';
import { PortraitFolder, PortraitAsset } from '@/common/models';
import { getRandomInt } from './photo';
import { CLASS_ROLE } from '@/common/constants';

import TEACHER_THUMB_01 from '@/assets/image/teacher1.jpg';
import TEACHER_THUMB_02 from '@/assets/image/teacher2.jpg';
import ASSISTANT_THUMB_01 from '@/assets/image/assistant1.jpg';
import STUDENT_THUMB_01 from '@/assets/image/student1.jpg';
import STUDENT_THUMB_02 from '@/assets/image/student2.jpg';
import STUDENT_THUMB_03 from '@/assets/image/student3.jpg';

const teacher1 = new PortraitAsset({
  id: uniqueId(),
  firstName: 'Mary',
  lastName: 'Willis',
  thumbUrl: TEACHER_THUMB_01,
  imageUrl: TEACHER_THUMB_01,
  classRole: CLASS_ROLE.PRIMARY_TEACHER
});

const teacher2 = new PortraitAsset({
  id: uniqueId(),
  firstName: 'Justin',
  lastName: 'Hogeterp',
  thumbUrl: TEACHER_THUMB_02,
  imageUrl: TEACHER_THUMB_02,
  classRole: CLASS_ROLE.PRIMARY_TEACHER
});

const assistant1 = new PortraitAsset({
  id: uniqueId(),
  firstName: 'Mildred',
  lastName: 'Smith',
  thumbUrl: ASSISTANT_THUMB_01,
  imageUrl: ASSISTANT_THUMB_01,
  classRole: CLASS_ROLE.ASSISTANT_TEACHER
});

const student1 = new PortraitAsset({
  id: uniqueId(),
  firstName: 'Tom',
  lastName: 'Hiddleston',
  thumbUrl: STUDENT_THUMB_01,
  imageUrl: STUDENT_THUMB_01,
  classRole: CLASS_ROLE.STUDENT
});

const student2 = new PortraitAsset({
  id: uniqueId(),
  firstName: 'Robert',
  lastName: 'Thompson',
  thumbUrl: STUDENT_THUMB_02,
  imageUrl: STUDENT_THUMB_02,
  classRole: CLASS_ROLE.STUDENT
});

const student3 = new PortraitAsset({
  id: uniqueId(),
  firstName: 'Join',
  lastName: 'Hiddleston',
  thumbUrl: STUDENT_THUMB_03,
  imageUrl: STUDENT_THUMB_03,
  classRole: CLASS_ROLE.STUDENT
});

const studentsBase = [student1, student2, student3];

const getRandomStudents = studentsCount => {
  const students = [];
  for (let i = 0; i < studentsCount; i++) {
    const student = new PortraitAsset({
      ...studentsBase[getRandomInt(3)],
      id: uniqueId()
    });
    students.push(student);
  }
  return students;
};

const folder1 = new PortraitFolder({
  id: uniqueId(),
  name: 'Administration and Staff',
  thumbUrl: TEACHER_THUMB_01,
  assetsCount: 47,
  assets: [teacher1, assistant1, ...getRandomStudents(45)]
});

const folder2 = new PortraitFolder({
  id: uniqueId(),
  name: '6th Grade',
  thumbUrl: STUDENT_THUMB_01,
  assetsCount: 72,
  assets: [teacher2, assistant1, ...getRandomStudents(70)]
});

const folder3 = new PortraitFolder({
  id: uniqueId(),
  name: 'Letter',
  thumbUrl: TEACHER_THUMB_02,
  assetsCount: 61,
  assets: [teacher2, ...getRandomStudents(60)]
});

const folder4 = new PortraitFolder({
  id: uniqueId(),
  name: 'The best students of Mr. Thompson Year 2019',
  thumbUrl: STUDENT_THUMB_02,
  assetsCount: 55,
  assets: [teacher1, ...getRandomStudents(53)]
});

export const portraitFolders = [folder1, folder2, folder3, folder4];
