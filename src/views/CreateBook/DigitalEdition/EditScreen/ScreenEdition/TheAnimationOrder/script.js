import { useGetterDigitalSheet } from '@/hooks';

export default {
  setup() {
    const { totalPlayOutOrder } = useGetterDigitalSheet();

    return { totalPlayOutOrder };
  }
};
