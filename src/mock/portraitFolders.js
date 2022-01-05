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
  name: '6th Grade with 2 Teachers and 1 Assistant',
  thumbUrl: STUDENT_THUMB_01,
  assetsCount: 73,
  assets: [teacher1, teacher2, assistant1, ...getRandomStudents(70)]
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
  assetsCount: 54,
  assets: [assistant1, ...getRandomStudents(53)]
});

const folder5 = new PortraitFolder({
  id: uniqueId(),
  name: 'No Teacher Class',
  thumbUrl: STUDENT_THUMB_01,
  assetsCount: 30,
  assets: [...getRandomStudents(30)]
});

const folder6 = new PortraitFolder({
  id: uniqueId(),
  name: 'Three Teachers Class',
  thumbUrl: TEACHER_THUMB_01,
  assetsCount: 43,
  assets: [teacher1, teacher2, teacher1, ...getRandomStudents(40)]
});

const folder7 = new PortraitFolder({
  id: uniqueId(),
  name: '3 Teachers and 1 Assistant',
  thumbUrl: TEACHER_THUMB_02,
  assetsCount: 44,
  assets: [teacher1, teacher2, teacher1, assistant1, ...getRandomStudents(40)]
});

const folder8 = new PortraitFolder({
  id: uniqueId(),
  name: '2 Teachers and 2 Assistants',
  thumbUrl: TEACHER_THUMB_02,
  assetsCount: 44,
  assets: [teacher1, teacher2, assistant1, assistant1, ...getRandomStudents(40)]
});

const folder9 = new PortraitFolder({
  id: uniqueId(),
  name: '1 Teachers and 2 Assistants',
  thumbUrl: TEACHER_THUMB_01,
  assetsCount: 43,
  assets: [teacher1, assistant1, assistant1, ...getRandomStudents(40)]
});

const folder10 = new PortraitFolder({
  id: uniqueId(),
  name: '1 Teachers and 1 Assistants',
  thumbUrl: TEACHER_THUMB_01,
  assetsCount: 6,
  assets: [teacher2, assistant1, ...getRandomStudents(4)]
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

const TEACHER1 = {
  first_name: 'Reese',
  full_name: 'Reese Braker',
  last_name: 'Braker',
  primary_portrait_image:
    'http://s3.amazonaws.com/fms.prod/media/0ff9bf4ecd4b1f52a17c9699d73cce5a4dd4567f9ef9e97256f4e050c735a110d535805747284aa099945995e9ae71aa7f2de1b4818762d045f81969bb564587/f8306fa7fc8335dcb42c10e783c9e398daniel_original.jpg?1609944705',
  subject_type: 'TEACHER'
};

const TEACHER2 = {
  first_name: 'Lochlan',
  full_name: 'Lochlan DeBruin',
  last_name: 'DeBruin',
  primary_portrait_image:
    'http://s3.amazonaws.com/fms.prod/media/252d3ddf3fcfe7485c8d0cc4c64b5e9b81cb09620c957df28b8649320ec9b8ccd51265062a2d7d2e280cf987c6827952b7dafd2e9cb20d2d4fd7d561d18cf1df/3a822b24455cfd4989ecd2b58e4f3e16micheal_original.jpg?1610402283',
  subject_type: 'TEACHER'
};

const TEACHER3 = {
  first_name: 'Sara',
  full_name: 'Sara Tims',
  last_name: 'Tims',
  primary_portrait_image:
    'http://s3.amazonaws.com/fms.prod/media/619f3b6e866986114e9a1fbe1de1ba77ab0f8dd23d42efc97b576e3cf3974f1b982ca61de2fac0727abf906f8d22373597b7587e4b4e3c40627e4830ba9554d0/c289daff09836f324f404ee7937defbbpexels-zen-chung-5745281_original.jpg?1641332078',
  subject_type: 'TEACHER'
};
const ASSISTANT1 = {
  first_name: 'Gutair',
  full_name: 'Gutair man',
  last_name: 'man',
  primary_portrait_image:
    'http://s3.amazonaws.com/fms.prod/media/26e862ecceee6f157dbe797ddb341fd6bce66bc250ee2e318d5e3a16bce8e9d7ebdc2b2087290666be8f0264fbee0cab1f8a6f525f518de785975e06bfa181c9/f175f3b3ab9ccffc8a0017833f10c7e3pexels-eren-li-7169607_original.jpg?1641332096',
  subject_type: 'ASSISTANT'
};

const ASSISTANT2 = {
  first_name: 'Kevin',
  full_name: 'Kevin Ipman',
  last_name: 'Ipman',
  primary_portrait_image:
    'http://s3.amazonaws.com/fms.prod/media/8df92ac3d783a5e2f13a45e067eb5fe3ea39a47ab7e1df405bd469992fb9a5c2b1c056d90f5c9cc09ecfb8aaaef3b5afdd8736b6ba201905bfaeb79cb4ad272a/16985d8662e4044c88c135d421c3cb4dpexels-monstera-5200778_original.jpg?1641331938',
  subject_type: 'ASSISTANT'
};

const testFolder1 = {
  name: 'One Teacher',
  assets_count: 1,
  portrait_subjects: [TEACHER1]
};

const testFolder2 = {
  name: '1 Teacher and 1 assistant',
  assets_count: 2,
  portrait_subjects: [TEACHER1, ASSISTANT1]
};

const testFolder3 = {
  name: '1 Teachers and 2 Assistants',
  assets_count: 3,
  portrait_subjects: [TEACHER1, ASSISTANT1, ASSISTANT2]
};

const testFolder4 = {
  name: '6th Grade with 2 Teachers and 1 Assistant',
  assets_count: 3,
  portrait_subjects: [TEACHER1, TEACHER2, ASSISTANT1]
};

const testFolder5 = {
  name: '2 Teachers and 2 Assistants',
  assets_count: 4,
  portrait_subjects: [TEACHER1, TEACHER2, ASSISTANT1, ASSISTANT2]
};

const testFolder6 = {
  name: 'Three Teachers Class',
  assets_count: 3,
  portrait_subjects: [TEACHER1, TEACHER2, TEACHER3]
};

const testFolder7 = {
  name: '3 Teachers and 1 Assistant',
  assets_count: 4,
  portrait_subjects: [TEACHER1, TEACHER2, TEACHER3, ASSISTANT1]
};

export const testPortraitFolders = [
  testFolder1,
  testFolder2,
  testFolder3,
  testFolder4,
  testFolder5,
  testFolder6,
  testFolder7
];
