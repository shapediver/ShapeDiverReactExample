import React from "react";
import { useViewport } from "hooks/shapediver/useViewport";
import { ViewportCreateDto } from "types/store/shapediverStoreViewer";
import classes from "./ViewportComponent.module.css";


interface Props extends ViewportCreateDto {
	children?: React.ReactNode;
	className?: string;
}
/**
 * Functional component that creates a canvas in which a viewport with the specified properties is loaded.
 *
 * @returns
 */
export default function ViewportComponent(props: Props) {
	const { children = <></>, className = "" } = props;
	const { canvasRef } = useViewport(props);

	return (
		<div className={`${classes.container} ${className}`}>
			<canvas ref={canvasRef} />
			{children}
		</div>
	);
}
