import Component from '@ember/component';
import NexusMixin from 'euclidean-cracked/mixins/nexus-ui';
import { set, computed } from "@ember/object";

import $ from "jquery";

export default Component.extend(NexusMixin, {

  classNames: ['ui-multislider'],
  tagName: 'span',

  sliderColor: '#2bb', // TODO: pass this in from main slider config
  sliderBgColor: '#eee',

  didInsertElement() {
    this._super(...arguments);
    this._nexusInit();
    this.
    _styleInit();
  },

  ElementName: 'Multislider',

  didReceiveAttrs() {
    this._super(...arguments);
    this._styleOnStep();
  },

  defaultValues: computed({
    get() {
      let len = 16; // max possible steps in sequence

      return Array.from(new Array(len),(val, idx)=> {
        let jitter = idx % 2 ? .05 : 0;
        return 0.7 + jitter;
      });
    }
  }),

  ElementOptions: computed('max', 'step', 'value', 'size',{
    get() {
      let values = this.values || this.defaultValues;
      values = values.slice(0, this.numberOfSliders);
      return {
        'size': this.size || [400, 100],
        'min': this.min || 0,
        'max': this.max || 1,
        'numberOfSliders': this.numberOfSliders || 4,
        'step': this.step || 0,
        'values': values,
      };
    }
  }),

  _styleInit() {
    // lookup rect elements by color match(not ideal)
    let fgColor = this.sliderColor;

    let $rectElements = this.$(`#${this.nexusId}`)
      .find(`rect[fill='${fgColor}']`);

    set(this, '$rectElements', $rectElements);

    this.applyStyle();
  },

  _styleOnStep() {
    let $rectElements = this.$rectElements;
    let index = this.stepIndex;

    if ($rectElements && index) {
      this.applyStyle();
      this.$($rectElements[index - 1]).attr('stroke', 'red');
    }
  },

  applyStyle() {
    let $rectElements = this.$rectElements;
    let sequence = this.sequence;
    let bgColor = this.sliderBgColor;
    let fgColor = this.sliderColor;

    $rectElements.each(function(idx) {
      let stroke = sequence[idx] ? bgColor : fgColor;
      let fill = sequence[idx] ? fgColor : bgColor;
      $(this).attr('stroke', stroke);
      $(this).attr('fill', fill);
    });
  }

});
