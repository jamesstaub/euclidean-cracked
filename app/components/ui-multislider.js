import Ember from 'ember';
import NexusMixin from 'euclidean-cracked/mixins/nexus-ui';
import { get, set, computed } from "@ember/object";

import $ from "jquery";

export default Ember.Component.extend(NexusMixin, {

  classNames: ['ui-multislider'],
  tagName: ['span'],

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
      let len = 16; //max possible steps in sequence

      return Array.from(new Array(len),(val, idx)=> {
        let jitter = idx % 2 ? .05 : 0;
        return 0.7 + jitter;
      });
    }
  }),

  ElementOptions: computed('max', 'step', 'value', 'size',{
    get() {
      let values = get(this, 'values') || get(this, 'defaultValues');
      values = values.slice(0, get(this, 'numberOfSliders'));
      return {
        'size': get(this, 'size') || [400, 100],
        'min': get(this, 'min') || 0,
        'max': get(this, 'max') || 1,
        'numberOfSliders': get(this, 'numberOfSliders') || 4,
        'step': get(this, 'step') || 0,
        'values': values,
      }
    }
  }),

  _styleInit() {
    // lookup rect elements by color match(not ideal)
    let fgColor = get(this,'sliderColor');

    let $rectElements = this.$(`#${get(this, 'nexusId')}`)
      .find(`rect[fill='${fgColor}']`);

    set(this, '$rectElements', $rectElements);

    this.applyStyle()
  },

  _styleOnStep() {

    let $rectElements = get(this, '$rectElements');
    let index = get(this, 'stepIndex');

    if ($rectElements && index) {
      this.applyStyle()
      this.$($rectElements[index - 1]).attr('stroke', 'red');
    }
  },

  applyStyle() {
    let $rectElements = get(this, '$rectElements');
    let sequence = get(this, 'sequence');
    let bgColor = get(this,'sliderBgColor');
    let fgColor = get(this,'sliderColor');

    $rectElements.each(function(idx) {
      let stroke = sequence[idx] ? bgColor : fgColor;
      let fill = sequence[idx] ? fgColor : bgColor;
      $(this).attr('stroke', stroke);
      $(this).attr('fill', fill);
    });
  }

});
