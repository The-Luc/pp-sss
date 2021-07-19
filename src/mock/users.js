import AVATAR_A from '@/assets/image/users/avatar-a.png';
import AVATAR_G from '@/assets/image/users/avatar-g.png';

import { ROLE } from '@/common/constants';

const allUsers = [
  {
    id: 1,
    name: 'Justin Hogeterp',
    avatarThumbUrl: AVATAR_A,
    role: ROLE.USER
  },
  {
    id: 35,
    name: 'Don Willis',
    avatarThumbUrl: AVATAR_A,
    role: ROLE.ADMIN
  },
  {
    id: 893,
    name: 'Emily Willis',
    avatarThumbUrl: AVATAR_A,
    role: ROLE.USER
  },
  {
    id: 3611,
    name: 'Mildred Smith',
    avatarThumbUrl: AVATAR_A,
    role: ROLE.USER
  },
  {
    id: 3615,
    name: 'Candy Henderson',
    avatarThumbUrl: AVATAR_A,
    role: ROLE.USER
  },
  {
    id: 3616,
    name: 'Matt Kreh',
    avatarThumbUrl: AVATAR_A,
    role: ROLE.USER
  },
  {
    id: 3617,
    name: 'Amanda Whymer',
    avatarThumbUrl: AVATAR_A,
    role: ROLE.USER
  },
  {
    id: 4358,
    name: 'Brian Wood',
    avatarThumbUrl: AVATAR_A,
    role: ROLE.USER
  },
  {
    id: 5562,
    name: 'Riley Willis',
    avatarThumbUrl: AVATAR_A,
    role: ROLE.USER
  },
  {
    id: 5565,
    name: 'George Bailey',
    avatarThumbUrl: AVATAR_A,
    role: ROLE.USER
  },
  {
    id: 5576,
    name: 'Morgan Willis',
    avatarThumbUrl: AVATAR_A,
    role: ROLE.USER
  },
  {
    id: 5614,
    name: 'Parker Willis',
    avatarThumbUrl: AVATAR_A,
    role: ROLE.USER
  },
  {
    id: 5680,
    name: 'Riley Willlis',
    avatarThumbUrl: AVATAR_A,
    role: ROLE.USER
  },
  {
    id: 5701,
    name: 'George Bailey Willis',
    avatarThumbUrl: AVATAR_A,
    role: ROLE.USER
  },
  {
    id: 5709,
    name: 'Nat King Willis',
    avatarThumbUrl: AVATAR_A,
    role: ROLE.USER
  },
  {
    id: 5743,
    name: 'Riley Baytree',
    avatarThumbUrl: AVATAR_A,
    role: ROLE.USER
  },
  {
    id: 5961,
    name: 'Riley Augusta',
    avatarThumbUrl: AVATAR_A,
    role: ROLE.USER
  },
  {
    id: 5771,
    name: 'Andrew Goodrick-Werner',
    avatarThumbUrl: AVATAR_A,
    role: ROLE.USER
  },
  {
    id: 8262,
    name: 'Giang Dao',
    avatarThumbUrl: AVATAR_G,
    role: ROLE.ADMIN
  },
  {
    id: 8263,
    name: 'Nhim Dao',
    avatarThumbUrl: AVATAR_G,
    role: ROLE.USER
  },
  {
    id: 8321,
    name: 'Ryushou',
    avatarThumbUrl: AVATAR_G,
    role: ROLE.ADMIN
  },
  {
    id: 8322,
    name: 'Nhan Huynh',
    avatarThumbUrl: AVATAR_G,
    role: ROLE.USER
  },
  {
    id: 8323,
    name: 'Liem Dang',
    avatarThumbUrl: AVATAR_G,
    role: ROLE.USER
  },
  {
    id: 8324,
    name: 'Truong Do',
    avatarThumbUrl: AVATAR_G,
    role: ROLE.USER
  },
  {
    id: 8325,
    name: 'Khanh Nguyen',
    avatarThumbUrl: AVATAR_G,
    role: ROLE.USER
  },
  {
    id: 8326,
    name: 'Dong Dang',
    avatarThumbUrl: AVATAR_G,
    role: ROLE.USER
  },
  {
    id: 8327,
    name: 'Giang Tran',
    avatarThumbUrl: AVATAR_G,
    role: ROLE.ADMIN
  },
  {
    id: 8328,
    name: 'Luan Nguyen',
    avatarThumbUrl: AVATAR_G,
    role: ROLE.USER
  },
  {
    id: 8329,
    name: 'Lucas Nguyen',
    avatarThumbUrl: AVATAR_G,
    role: ROLE.USER
  },
  {
    id: 8330,
    name: 'Khanh Leng',
    avatarThumbUrl: AVATAR_G,
    role: ROLE.ADMIN
  }
];

export const users = allUsers.map(u => ({
  name: u.name,
  value: u.id,
  role: Object.keys(ROLE).find(k => ROLE[k] === u.role)
}));

export const communityUsers = allUsers
  .filter(u => u.role === ROLE.USER)
  .sort((u1, u2) => (u1.name > u2.name ? 1 : -1));
