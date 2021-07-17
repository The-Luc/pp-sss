import AVATAR_A from '@/assets/image/users/avatar-a.png';
import AVATAR_G from '@/assets/image/users/avatar-g.png';

import { ROLE } from '@/common/constants';

const allUsers = [
  {
    id: 1,
    fullName: 'Justin Hogeterp',
    avatarThumbUrl: AVATAR_A,
    role: ROLE.USER
  },
  {
    id: 35,
    fullName: 'Don Willis',
    avatarThumbUrl: AVATAR_A,
    role: ROLE.ADMIN
  },
  {
    id: 893,
    fullName: 'Emily Willis',
    avatarThumbUrl: AVATAR_A,
    role: ROLE.USER
  },
  {
    id: 3611,
    fullName: 'Mildred Smith',
    avatarThumbUrl: AVATAR_A,
    role: ROLE.USER
  },
  {
    id: 3615,
    fullName: 'Candy Henderson',
    avatarThumbUrl: AVATAR_A,
    role: ROLE.USER
  },
  {
    id: 3616,
    fullName: 'Matt Kreh',
    avatarThumbUrl: AVATAR_A,
    role: ROLE.USER
  },
  {
    id: 3617,
    fullName: 'Amanda Whymer',
    avatarThumbUrl: AVATAR_A,
    role: ROLE.USER
  },
  {
    id: 4358,
    fullName: 'Brian Wood',
    avatarThumbUrl: AVATAR_A,
    role: ROLE.USER
  },
  {
    id: 5562,
    fullName: 'Riley Willis',
    avatarThumbUrl: AVATAR_A,
    role: ROLE.USER
  },
  {
    id: 5565,
    fullName: 'George Bailey',
    avatarThumbUrl: AVATAR_A,
    role: ROLE.USER
  },
  {
    id: 5576,
    fullName: 'Morgan Willis',
    avatarThumbUrl: AVATAR_A,
    role: ROLE.USER
  },
  {
    id: 5614,
    fullName: 'Parker Willis',
    avatarThumbUrl: AVATAR_A,
    role: ROLE.USER
  },
  {
    id: 5680,
    fullName: 'Riley Willlis',
    avatarThumbUrl: AVATAR_A,
    role: ROLE.USER
  },
  {
    id: 5701,
    fullName: 'George Bailey Willis',
    avatarThumbUrl: AVATAR_A,
    role: ROLE.USER
  },
  {
    id: 5709,
    fullName: 'Nat King Willis',
    avatarThumbUrl: AVATAR_A,
    role: ROLE.USER
  },
  {
    id: 5743,
    fullName: 'Riley Baytree',
    avatarThumbUrl: AVATAR_A,
    role: ROLE.USER
  },
  {
    id: 5961,
    fullName: 'Riley Augusta',
    avatarThumbUrl: AVATAR_A,
    role: ROLE.USER
  },
  {
    id: 5771,
    fullName: 'Andrew Goodrick-Werner',
    avatarThumbUrl: AVATAR_A,
    role: ROLE.USER
  },
  {
    id: 8262,
    fullName: 'Giang Dao',
    avatarThumbUrl: AVATAR_G,
    role: ROLE.ADMIN
  },
  {
    id: 8263,
    fullName: 'Nhim Dao',
    avatarThumbUrl: AVATAR_G,
    role: ROLE.USER
  },
  {
    id: 8321,
    fullName: 'Ryushou',
    avatarThumbUrl: AVATAR_G,
    role: ROLE.ADMIN
  },
  {
    id: 8322,
    fullName: 'Nhan Huynh',
    avatarThumbUrl: AVATAR_G,
    role: ROLE.USER
  },
  {
    id: 8323,
    fullName: 'Liem Dang',
    avatarThumbUrl: AVATAR_G,
    role: ROLE.USER
  },
  {
    id: 8324,
    fullName: 'Truong Do',
    avatarThumbUrl: AVATAR_G,
    role: ROLE.USER
  },
  {
    id: 8325,
    fullName: 'Khanh Nguyen',
    avatarThumbUrl: AVATAR_G,
    role: ROLE.USER
  },
  {
    id: 8326,
    fullName: 'Dong Dang',
    avatarThumbUrl: AVATAR_G,
    role: ROLE.USER
  },
  {
    id: 8327,
    fullName: 'Giang Tran',
    avatarThumbUrl: AVATAR_G,
    role: ROLE.ADMIN
  },
  {
    id: 8328,
    fullName: 'Luan Nguyen',
    avatarThumbUrl: AVATAR_G,
    role: ROLE.USER
  },
  {
    id: 8329,
    fullName: 'Lucas Nguyen',
    avatarThumbUrl: AVATAR_G,
    role: ROLE.USER
  },
  {
    id: 8330,
    fullName: 'Khanh Leng',
    avatarThumbUrl: AVATAR_G,
    role: ROLE.ADMIN
  }
];

export const users = allUsers.map(u => ({
  name: u.fullName,
  value: u.id,
  role: Object.keys(ROLE).find(k => ROLE[k] === u.role)
}));

export const communityUsers = allUsers
  .filter(u => {
    u.role === ROLE.USER;
  })
  .sort((u1, u2) => (u1.fullName > u2.fullName ? 1 : -1));
