export const layouts = {
  1: [
    {
      id: '1-a',
      label: 'Single',
      tree: { direction: 'horizontal', children: [{}] }
    }
  ],
  2: [
    {
      id: '2-a',
      label: 'Side by side',
      tree: {
        direction: 'horizontal',
        children: [{}, {}]
      }
    },
    {
      id: '2-b',
      label: 'Stacked',
      tree: {
        direction: 'vertical',
        children: [{}, {}]
      }
    }
  ],
  3: [
    {
      id: '3-a',
      label: 'Three columns',
      tree: {
        direction: 'horizontal',
        children: [{}, {}, {}]
      }
    },
    {
      id: '3-b',
      label: 'Left wide, right stacked',
      tree: {
        direction: 'horizontal',
        children: [
          {},
          {
            direction: 'vertical',
            children: [{}, {}]
          }
        ]
      }
    },
    {
      id: '3-c',
      label: 'Left stacked, right wide',
      tree: {
        direction: 'horizontal',
        children: [
          {
            direction: 'vertical',
            children: [{}, {}]
          },
          {}
        ]
      }
    }
  ],
  4: [
    {
      id: '4-a',
      label: '2x2 grid',
      tree: {
        direction: 'vertical',
        children: [
          {
            direction: 'horizontal',
            children: [{}, {}]
          },
          {
            direction: 'horizontal',
            children: [{}, {}]
          }
        ]
      }
    },
    {
      id: '4-b',
      label: 'Four columns',
      tree: {
        direction: 'horizontal',
        children: [{}, {}, {}, {}]
      }
    },
    {
      id: '4-c',
      label: 'Left wide, right 3 stacked',
      tree: {
        direction: 'horizontal',
        children: [
          {},
          {
            direction: 'vertical',
            children: [{}, {}, {}]
          }
        ]
      }
    },
    {
      id: '4-d',
      label: 'Left 3 stacked, right wide',
      tree: {
        direction: 'horizontal',
        children: [
          {
            direction: 'vertical',
            children: [{}, {}, {}]
          },
          {}
        ]
      }
    }
  ]
}
