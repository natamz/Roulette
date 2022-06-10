import Wheel from "../Wheel.vue";

export default {
  title: "Wheel",
  component: Wheel,
  argTypes: {
    click: {
      action: "click",
    },
  },
};

const Template = (args) => ({
  components: { Wheel },
  setup() {
    return {
      args,
    };
  },
  template: `
    <wheel :items="items"></wheel>
  `,
});

export const Primary = Template.bind({});
Primary.args = {
  items: [
    {
      id: 1,
      value: "hoge",
      color: "#ff0000",
    },
    {
      id: 2,
      value: "fuga",
      color: "#00ff00",
    },
  ],
};
