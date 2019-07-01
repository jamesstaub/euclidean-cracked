import Component from '@ember/component';
import NexusMixin from 'euclidean-cracked/mixins/nexus-ui';
import { set, computed } from "@ember/object";
import DidChangeAttrs from 'ember-did-change-attrs';
import $ from "jquery";

export default Component.extend(NexusMixin, DidChangeAttrs, {

  classNames: ['ui-multislider'],
  tagName: 'span',

  init() {
    this._super(...arguments);
    this.setProperties({
      sliderColor: '#52ebff',
      sliderBgColor: '#eeeeee',
    });    
  },

  didInsertElement() {
    this._super(...arguments);
    this._nexusInit();
    this._styleInit();
  },

  ElementName: 'Multislider',

  // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
  didChangeAttrsConfig: {
    attrs: ['size', 'step', 'values', 'numberOfSliders', 'min', 'max']
  },

  // eslint-disable-next-line complexity
  didChangeAttrs(changes) {
    this._super(...arguments);

    if ((changes.size || changes.numberOfSliders) || (changes.min || changes.max)) {
      this._nexusInit();
      this._styleInit();
    }

    if ((changes.min || changes.max)) {
      this.NexusElement.setAllSliders(this.values);
    }

    if (changes.step) {
      this._styleOnStep();
    }
  },

  afterInitNexus(NexusElement) {
    NexusElement.colorize('accent', '#52ebff');
    NexusElement.colorize('fill', '#eeeeee');
  },

  ElementOptions: computed('max', 'step', 'values', 'size', 'numberOfSliders',{
    // eslint-disable-next-line complexity
    get() {
      let values = this.values;
      values = values.slice(0, this.numberOfSliders);
      return {
        'size': this.size || [400, 100],
        'min': this.min,
        'max': this.max,
        'candycane': 0,
        'numberOfSliders': this.numberOfSliders || 4,
        'step': this.step || 0,
        'values': values,
      };
    }
  }),

  _styleInit() {
    // lookup rect elements by color match(not ideal)
    let fgColor = this.sliderColor;

    // FIXME terible selector for the nexus ui right here. 
    let $rectElements = this.$(`#${this.nexusId}`)
      .find(`rect[fill='${fgColor}'][height=120]`);
    set(this, '$rectElements', $rectElements);
    this.applyStyle();
  },

  _styleOnStep() {
    let $rectElements = this.$rectElements;
    if ($rectElements && this.stepIndex) {
      this.applyStyle();
      let rectIndex = this.stepIndex - 1;
      // hack to avoid off by one error in current step display
      if (rectIndex === this.sequence.length - 2) {
        rectIndex = rectIndex + 1;
      }
      this.$($rectElements[rectIndex]).attr('stroke', 'red');
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
