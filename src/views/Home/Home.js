import { getUsers } from "../../api/user";

export default {
  methods: {
    handleClick: async () => {
      const data = await getUsers();
      console.log(data);
    }
  }
};
