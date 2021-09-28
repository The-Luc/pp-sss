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
  assets: [teacher1, assistant1, ...getRandomStudents(45)],
  isSelected: false
});

const folder2 = new PortraitFolder({
  id: uniqueId(),
  name: '6th Grade with 2 Teachers and 1 Assistant',
  thumbUrl: STUDENT_THUMB_01,
  assetsCount: 73,
  assets: [teacher1, teacher2, assistant1, ...getRandomStudents(70)],
  isSelected: false
});

const folder3 = new PortraitFolder({
  id: uniqueId(),
  name: 'Letter',
  thumbUrl: TEACHER_THUMB_02,
  assetsCount: 61,
  assets: [teacher2, ...getRandomStudents(60)],
  isSelected: false
});

const folder4 = new PortraitFolder({
  id: uniqueId(),
  name: 'The best students of Mr. Thompson Year 2019',
  thumbUrl: STUDENT_THUMB_02,
  assetsCount: 54,
  assets: [assistant1, ...getRandomStudents(53)],
  isSelected: false
});

const folder5 = new PortraitFolder({
  id: uniqueId(),
  name: 'No Teacher Class',
  thumbUrl: STUDENT_THUMB_01,
  assetsCount: 30,
  assets: [...getRandomStudents(30)],
  isSelected: false
});

const folder6 = new PortraitFolder({
  id: uniqueId(),
  name: 'Three Teachers Class',
  thumbUrl: TEACHER_THUMB_01,
  assetsCount: 43,
  assets: [teacher1, teacher2, teacher1, ...getRandomStudents(40)],
  isSelected: false
});

const folder7 = new PortraitFolder({
  id: uniqueId(),
  name: '3 Teachers and 1 Assistant',
  thumbUrl: TEACHER_THUMB_02,
  assetsCount: 44,
  assets: [teacher1, teacher2, teacher1, assistant1, ...getRandomStudents(40)],
  isSelected: false
});

const folder8 = new PortraitFolder({
  id: uniqueId(),
  name: '2 Teachers and 2 Assistants',
  thumbUrl: TEACHER_THUMB_02,
  assetsCount: 44,
  assets: [
    teacher1,
    teacher2,
    assistant1,
    assistant1,
    ...getRandomStudents(40)
  ],
  isSelected: false
});

const folder9 = new PortraitFolder({
  id: uniqueId(),
  name: '1 Teachers and 2 Assistants',
  thumbUrl: TEACHER_THUMB_01,
  assetsCount: 43,
  assets: [teacher1, assistant1, assistant1, ...getRandomStudents(40)],
  isSelected: false
});

const folder10 = new PortraitFolder({
  id: uniqueId(),
  name: '1 Teachers and 1 Assistants',
  thumbUrl: TEACHER_THUMB_01,
  assetsCount: 6,
  assets: [teacher2, assistant1, ...getRandomStudents(4)],
  isSelected: false
});

export const portraitFolders = [
  folder1,
  folder2,
  folder3,
  folder4,
  folder5,
  folder6,
  folder7,
  folder8,
  folder9,
  folder10
];
