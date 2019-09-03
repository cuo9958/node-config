import { observable, action } from "mobx";

class Demo {
    @observable show = false;

    @action toggle(show = !this.show) {
        this.show = show;
    }
}
export default new Demo();
