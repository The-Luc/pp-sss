import { fabric } from 'fabric';

export const startDrawBox = (canvas, event) =>
  new Promise(resolve => {
    canvas.selection = false;
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush.color = 'transparent';

    let rect, isMouseDown;
    const onMouseDown = () => {
      isMouseDown = true;
      const pointer = canvas.getPointer(event.e);
      rect = new fabric.Rect({
        left: pointer.x,
        top: pointer.y,
        width: 0,
        height: 0,
        stroke: 'black',
        strokeWidth: 3,
        fill: 'rgba(255, 255, 255, 0.1)',
        selectable: false
      });
      canvas.add(rect);
    };
    onMouseDown();
    const onMouseMove = o => {
      if (!isMouseDown) {
        return;
      }
      const pointer = canvas.getPointer(o.e);
      rect.set({
        width: Math.abs(pointer.x - rect.get('left')),
        height: Math.abs(pointer.y - rect.get('top'))
      });
      canvas.renderAll();
    };
    const onMouseUp = () => {
      isMouseDown = false;
      const data = {
        top: rect.get('top'),
        left: rect.get('left'),
        width: rect.get('width'),
        height: rect.get('height')
      };
      canvas.remove(rect);
      resolve(data);
      canvas.isDrawingMode = false;
      canvas.selection = true;
      canvas.off('mouse:move', onMouseMove);
      canvas.off('mouse:up', onMouseUp);
    };
    canvas.on('mouse:move', onMouseMove);
    canvas.on('mouse:up', onMouseUp);
  });
