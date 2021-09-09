export let gl: WebGL2RenderingContext;

export class GLUtilities {

    public static initialize( elementId?: string ): HTMLCanvasElement {
        let canvas: HTMLCanvasElement;

        if ( elementId !== undefined ) {
            canvas = document.getElementById(elementId) as HTMLCanvasElement;
            if ( canvas === undefined ) {
                throw new Error("Cannot find a canvas element named: " + elementId);
            }
        } else {
            if (document.getElementById('container')?.children.length > 0) {
                canvas = document.getElementsByTagName('canvas')[0] as HTMLCanvasElement;
            } else {
                canvas = document.createElement('canvas') as HTMLCanvasElement;
                document.getElementById('container')?.appendChild(canvas);
            }
        }
        canvas.id = 'gameCanvas';
        gl = canvas.getContext('webgl2');
        if ( gl === null ) {
            throw new Error("Unable to initialize WebGl");
        }

        return canvas;
    }
}