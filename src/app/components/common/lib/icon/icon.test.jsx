import React from 'react';
import { shallow, mount, render } from 'enzyme';

import Icon from './icon';

describe('Icon component', () => {
  describe('without parameters', () => {
    it('should be selectable by class "icon"', () => {
      expect(shallow(<Icon />).is('.icon')).toBe(true);
    });

    it('should mount in a full DOM', () => {
      expect(mount(<Icon />).find('.icon').length).toBe(1);
    });

    it('should render to static HTML', () => {
      expect(render(<Icon />).text()).toEqual('');
    });
  });

  describe('with parameters', () => {
    it('should handle viewbox', () => {
      const dummyHtml = '<svg class="icon" viewbox="0 0 100 100"><use></use></svg>';

      expect(shallow(<Icon viewbox="0 0 100 100" />).html()).toBe(dummyHtml);
    });

    it('should handle className', () => {
      expect(shallow(<Icon className="test-class" />).is('.test-class')).toBe(true);
    });

    it('should handle height and width', () => {
      const dummyHtml = '<svg class="icon" width="1px" height="2px"><use></use></svg>';

      expect(shallow(<Icon width="1px" height="2px" />).html()).toBe(dummyHtml);
    });

    it('should handle style', () => {
      const dummyHtml = '<svg class="icon" style="border:none;"><use></use></svg>';
      const dummyStyle = {
        border: 'none'
      };

      expect(shallow(<Icon style={dummyStyle} />).html()).toBe(dummyHtml);
    });

    it('should handle glyph', () => {
      const dummyHtml = '<svg class="icon"><use xlink:href="a"></use></svg>';

      expect(shallow(<Icon glyph="a" />).html()).toBe(dummyHtml);
    });
  });
});
