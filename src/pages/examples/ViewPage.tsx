import { IMaterialStandardDataProperties, MaterialEngine, MATERIAL_TYPE } from "@shapediver/viewer";
import ViewportComponent from "components/shapediver/viewport/ViewportComponent";
import React, { useEffect, useMemo, useState } from "react";
import ParametersAndExportsAccordionComponent from "components/shapediver/ui/ParametersAndExportsAccordionComponent";
import { useSession } from "hooks/shapediver/useSession";
import ExamplePage from "pages/templates/ExampleTemplatePage";
import ViewportOverlayWrapper from "../../components/shapediver/viewport/ViewportOverlayWrapper";
import ViewportIcons from "../../components/shapediver/viewport/ViewportIcons";
import { useSessionPropsParameter } from "hooks/shapediver/parameters/useSessionPropsParameter";
import { useSessionPropsExport } from "hooks/shapediver/parameters/useSessionPropsExport";
import { IGenericParameterDefinition } from "types/store/shapediverStoreParameters";
import { useDefineGenericParameters } from "hooks/shapediver/parameters/useDefineGenericParameters";
import { useOutputMaterial } from "hooks/shapediver/viewer/useOutputMaterial";
import AcceptRejectButtons from "../../components/shapediver/ui/AcceptRejectButtons";
import useAppBuilderSettings from "hooks/shapediver/useAppBuilderSettings";
import TabsComponent, { ITabsComponentProps } from "components/ui/TabsComponent";
import { IconTypeEnum } from "types/shapediver/icons";
import { ShapeDiverResponseParameterType } from "@shapediver/api.geometry-api-dto-v2";
import { IAppBuilderSettingsSession } from "types/shapediver/appbuilder";
import useDefaultSessionDto from "hooks/shapediver/useDefaultSessionDto";

const VIEWPORT_ID = "viewport_1";

interface Props extends IAppBuilderSettingsSession {
	/** Name of example model */
	example?: string;
}

/**
 * Function that creates the view page.
 * The aside (right side) two tabs, one with a ParameterUiComponent and another with an ExportUiComponent
 * and a viewport and session in the main component. The session is connected via its id to the ParameterUiComponent and ExportUiComponent.
 *
 * @returns
 */
export default function ViewPage(props: Partial<Props>) {

	const { defaultSessionDto } = useDefaultSessionDto(props);
	const { settings } = useAppBuilderSettings(defaultSessionDto);
	const sessionCreateDto = settings ? settings.sessions[0] : undefined;
	const sessionId = sessionCreateDto?.id ?? "";

	// use a session with a ShapeDiver model and register its parameters
	const { sessionApi } = useSession(sessionCreateDto);
	useEffect(() => {
		if (sessionApi)
			console.debug(`Available output names: ${Object.values(sessionApi.outputs).map(o => o.name)}`);
	}, [sessionApi]);

	// get parameters that don't have a group or whose group name includes "export"
	const parameterProps = useSessionPropsParameter(sessionId, param => !param.group || !param.group.name.toLowerCase().includes("export"));
	// get parameters whose group name includes "export"
	const exportParameterProps = useSessionPropsParameter(sessionId, param => param.group?.name.toLowerCase().includes("export") ?? false);
	const exportProps = useSessionPropsExport(sessionId);

	/////
	// START - Example on how to apply a custom material to an output
	/////

	// define the parameter names for the custom material
	const enum PARAMETER_NAMES {
		COLOR = "color",
		MAP = "map",
		ROUGHNESS = "roughness",
		APPLY_TO_SHELF = "applyToShelf",
		APPLY_TO_PLANE = "applyToPlane"
	}

	// define parameters for the custom material
	const materialDefinitions: IGenericParameterDefinition[] = [
		{
			definition: {
				id: PARAMETER_NAMES.COLOR,
				name: "Custom color",
				defval: "0x0d44f0ff",
				type: ShapeDiverResponseParameterType.COLOR,
				hidden: false
			}
		},
		{
			definition: {
				id: PARAMETER_NAMES.MAP,
				name: "Custom map",
				defval: "",
				type: ShapeDiverResponseParameterType.STRING,
				hidden: false
			}
		},
		{
			definition: {
				id: PARAMETER_NAMES.ROUGHNESS,
				name: "Custom roughness",
				defval: "0",
				type: ShapeDiverResponseParameterType.FLOAT,
				min: 0,
				max: 1,
				decimalplaces: 4,
				hidden: false
			}
		},
		{
			definition: {
				id: PARAMETER_NAMES.APPLY_TO_SHELF,
				name: "Apply to shelf",
				defval: "false",
				type: ShapeDiverResponseParameterType.BOOL,
				hidden: false
			}
		},
		{
			definition: {
				id: PARAMETER_NAMES.APPLY_TO_PLANE,
				name: "Apply to plane",
				defval: "false",
				type: ShapeDiverResponseParameterType.BOOL,
				hidden: false
			}
		}
	];
	const [materialParameters] = useState<IGenericParameterDefinition[]>(materialDefinitions);

	// state for the custom material properties
	const [materialProperties, setMaterialProperties] = useState<IMaterialStandardDataProperties>({
		type: MATERIAL_TYPE.STANDARD,
		color: materialParameters.find(d => d.definition.id === PARAMETER_NAMES.COLOR)!.definition.defval,
		map: undefined,
		roughness: +materialParameters.find(d => d.definition.id === PARAMETER_NAMES.ROUGHNESS)!.definition.defval
	});

	// state for the custom material application
	const [outputNameShelf, setOutputNameShelf] = useState<string>("");
	const [outputNamePlane, setOutputNamePlane] = useState<string>("");

	// define the custom material parameters and a handler for the parameter changes
	const customSessionId = "mysession";
	useDefineGenericParameters(customSessionId, false /* acceptRejectMode */,
		materialParameters,
		async (values) => {
			if (PARAMETER_NAMES.COLOR in values)
				setMaterialProperties({ ...materialProperties, color: values[PARAMETER_NAMES.COLOR] });

			if (PARAMETER_NAMES.ROUGHNESS in values)
				setMaterialProperties({ ...materialProperties, roughness: values[PARAMETER_NAMES.ROUGHNESS] });

			// due to the asynchronous nature of loading a map, we need to wait for the map to be loaded before we can set the material properties
			// this also means that we resolve the promise only after the map has been loaded or if no map is specified
			if (PARAMETER_NAMES.MAP in values) {
				const mapParam = values[PARAMETER_NAMES.MAP];
				if (mapParam !== "") {
					try {
						const map = await MaterialEngine.instance.loadMap(mapParam);
						if (map) {
							setMaterialProperties({ ...materialProperties, map: map });
						} else {
							setMaterialProperties({ ...materialProperties, map: undefined });
							console.warn(`Could not load map ${mapParam}`);
						}
					} catch (e) {
						setMaterialProperties({ ...materialProperties, map: undefined });
						console.warn(`Could not load map ${mapParam}: ${e}`);
					}
				} else {
					setMaterialProperties({ ...materialProperties, map: undefined });
				}
			}

			if (PARAMETER_NAMES.APPLY_TO_SHELF in values)
				setOutputNameShelf(""+values[PARAMETER_NAMES.APPLY_TO_SHELF] === "true" ? "Shelf" : "");

			if (PARAMETER_NAMES.APPLY_TO_PLANE in values)
				setOutputNamePlane(""+values[PARAMETER_NAMES.APPLY_TO_PLANE] === "true" ? "Image Plane" : "");

			return values;
		}
	);
	const myParameterProps = useSessionPropsParameter(customSessionId);

	// apply the custom material
	useOutputMaterial(sessionId, outputNameShelf, materialProperties);
	useOutputMaterial(sessionId, outputNamePlane, materialProperties);

	/////
	// END - Example on how to apply a custom material to an output
	/////

	const tabProps: ITabsComponentProps = useMemo(() => { 
		return {
			defaultValue: "Parameters",
			tabs: [
				{
					name: "Parameters",
					icon: IconTypeEnum.AdjustmentsHorizontal,
					children: [
						<ParametersAndExportsAccordionComponent key={0}
							parameters={parameterProps.length > 0 ? parameterProps.concat(myParameterProps) : []}
							defaultGroupName="Custom material"
							topSection={<AcceptRejectButtons parameters={parameterProps}/>}
						/>
					]
				},
				{
					name: "Exports",
					icon: IconTypeEnum.Download,
					children: [
						<ParametersAndExportsAccordionComponent key={0}
							parameters={exportParameterProps}
							exports={exportProps}
							defaultGroupName="Exports"
							topSection={<AcceptRejectButtons parameters={exportParameterProps}/>}
						/>
					]
				}
			]
		};
	}, [parameterProps, exportParameterProps, exportProps, myParameterProps]);

	const parameterTabs = <TabsComponent {...tabProps} />;

	return (
		<>
			<ExamplePage aside={parameterTabs}>
				<ViewportComponent
					id={VIEWPORT_ID}
				>
					<ViewportOverlayWrapper>
						<ViewportIcons
							viewportId={VIEWPORT_ID}
						/>
					</ViewportOverlayWrapper>
				</ViewportComponent>
			</ExamplePage>
		</>
	);
}
