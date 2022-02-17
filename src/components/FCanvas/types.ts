
// https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
// type ContextTypeSettingMap = {
//     '2d': CanvasRenderingContext2DSettings
//     'bitmaprenderer': ImageBitmapRenderingContextSettings
//     'webgl': WebGLContextAttributes
//     'webgl2': WebGLContextAttributes
// }
// export type ContextType = keyof ContextTypeSettingMap
// type ContextOutputTypeMap = {
//     '2d': CanvasRenderingContext2D
//     'bitmaprenderer': ImageBitmapRenderingContext
//     'webgl': WebGLRenderingContext
//     'webgl2': WebGL2RenderingContext
// }
// export type ContextOutputType = keyof ContextOutputTypeMap

// export interface FCanvasProps<T extends ContextType> {
//     context: T
//     draw?: FCanvasDraw<ContextOutputTypeMap[T]>
//     option?: ContextTypeSettingMap[T]
// }

// export type FCanvasDraw<T> = ((ctx: T, frameCount?: number) => void)

export interface FCanvasProps {
    // context: CanvaCon
    draw?: FCanvasDraw
    option?: CanvasRenderingContext2DSettings
    width?:number
    height ?: number
}

export type FCanvasDraw = ((ctx: CanvasRenderingContext2D, frameCount?: number) => void)
