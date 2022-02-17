import { useEffect, useRef } from "react"
import { FCanvasProps} from "./types"

export const FCanvas = <T,>(props: FCanvasProps<T>) => {
    
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const { draw, option, height, width, state,  ...restProps} = props
    useEffect(() => {
        if (canvasRef.current && draw) {
            const ctx = canvasRef.current.getContext("2d", option)
            if (ctx !== null) {
                
                let frameCount = 0
                let animationFrameId:number = 0
                const render = () => {
                    frameCount++
                    draw(ctx as unknown as CanvasRenderingContext2D, frameCount)
                    animationFrameId = window.requestAnimationFrame(render)
                }
                render()
                return () => {
                    window.cancelAnimationFrame(animationFrameId)
                }
            }
        }
    }, [draw, option, state])

    useEffect(() =>{
        if(canvasRef.current && height && width){
            const dom = canvasRef.current.getBoundingClientRect()
            if(dom.height !== height || dom.width !== width){
                const context = canvasRef.current.getContext('2d')
                const { devicePixelRatio:ratio=1 } = window
                canvasRef.current.width = width * ratio
                canvasRef.current.height = height * ratio
                context !== null && context.scale(ratio, ratio)
            }
        }
    },[height, width])

    return (
        <canvas ref={canvasRef} {...restProps}/>
    )
}
