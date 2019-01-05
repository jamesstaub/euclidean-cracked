import Component from '@ember/component';

export default Component.extend({
  actions: {
    submitComment(author, body) {
      let post = this.post;
      this.sendAction('store', author, body, post);
      this.setProperties({
        body: ''
      });
    }
  }
});
