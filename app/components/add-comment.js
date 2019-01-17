import Component from '@ember/component';

export default Component.extend({
  actions: {
    submitComment(author, body) {
      let project = this.project;
      this.sendAction('store', author, body, project);
      this.setProperties({
        body: ''
      });
    }
  }
});
