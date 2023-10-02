import { createSession, ISessionApi } from "@shapediver/viewer";
import { SessionCreateDto, IShapediverStoreViewer } from "../types/store/shapediverStoreViewer";
import { create } from "zustand";

/**
 * Helper for comparing sessions.
 */
type ISessionCompare = { id: string, identifier: string, dto?: SessionCreateDto };

/**
 * Helper for comparing sessions.
 */
const createSessionIdentifier =  function(parameters: Pick<SessionCreateDto, "id" | "jwtToken" | "modelViewUrl" | "ticket" | "guid">) {
	return JSON.stringify({
		id: parameters.id,
		//jwtToken: parameters.jwtToken || "",
		//modelViewUrl: parameters.modelViewUrl,
		//ticket: parameters.ticket,
		//guid: parameters.guid,
	});
};

/**
 * Store of viewer-related data.
 */
export const useShapediverStoreViewer = create<IShapediverStoreViewer>((set, get) => ({
	
	activeViewports: {},
	
	/** TODO to be refactored */
	setActiveViewports: (activeViewports) =>
		set((state) => ({
			...state,
			activeViewports
		})),

	activeSessions: {},

	/**
	 * TODO review why we need this
	 * @returns 
	 */
	activeSessionsGet: () => {
		return get().activeSessions;
	},

	sessionCreate: async (
		dto: SessionCreateDto,
		callbacks: {
			onError?: (error: any) => void;
		} = {},
	) => {
		// in case a session with the same identifier exists, skip creating a new one
		const identifier = createSessionIdentifier(dto);
		const { activeSessions } = get();
		if ( Object.values(activeSessions).findIndex(s => identifier === createSessionIdentifier(s)) >= 0 )
			return;

		let session: ISessionApi|undefined = undefined;
		try {
			session = await createSession(dto);
		} catch (e: any) {
			if (callbacks.onError) callbacks.onError(e);
		}

		return set((state) => {
			return {
				//...state, // <-- according to the docs of zustand, this is not necessary at the top level. see https://github.com/pmndrs/zustand/blob/main/docs/guides/immutable-state-and-merging.md
				activeSessions: {
					...state.activeSessions,
					...session ? {[session.id]: session} : {},
				},
			};
		});
	},

	sessionClose: async (
		sessionId,
		callbacks: {
			onError?: (error: any) => void;
		} = {},) => {
		const { activeSessions } = get();

		let sessionIdDelete: string|undefined = undefined;
		const session = activeSessions[sessionId];

		if (session) {
			try {
				await session.close();
				sessionIdDelete = sessionId;
			} catch (e) {
				if (callbacks.onError) callbacks.onError(e);
			}
		}

		if (!sessionIdDelete) return;

		return set((state) => {
			const activeSessions = state.activeSessions;
			if (sessionIdDelete) 
				delete activeSessions[sessionId];

			return {
				//...state, // <-- according to the docs of zustand, this is not necessary at the top level. see https://github.com/pmndrs/zustand/blob/main/docs/guides/immutable-state-and-merging.md
				activeSessions,
			};
		});
	},

	sessionsSync: async (sessionDtos: SessionCreateDto[]) => {
		const { activeSessions, sessionCreate, sessionClose } = get();
		// Helps to skip typescript filter error
		const isSession = (session: ISessionCompare | undefined): session is ISessionCompare => !!session;
		// Get existing sessions
		const sessionsExist: ISessionCompare[] = Object.values(activeSessions).map((session) => session
			? { id: session.id, identifier: createSessionIdentifier(session) }
			: undefined).filter(isSession);
		// Convert SessionCreateDto[] to the ISessionCompare[]
		const sessionsDataNew = sessionDtos.map((sessionDto) => ({ id: sessionDto.id, identifier: createSessionIdentifier(sessionDto), data: sessionDto }));
		// Find sessions to delete
		const sessionsToDelete = sessionsExist.filter((sessionCompareExist) => {
			return sessionsDataNew.findIndex((sessionCompareNew) => {
				return sessionCompareNew.identifier === sessionCompareExist.identifier;
			}) === -1;
		});

		// Find sessions to create
		const sessionsToCreate = sessionsDataNew.filter((sessionCompareNew) => {
			return sessionsExist.findIndex((sessionCompareExist) => sessionCompareExist.identifier === sessionCompareNew.identifier) === -1;
		});

		return Promise.all([
			...sessionsToDelete.map((sessionToDelete) => sessionClose(sessionToDelete.id)),
			...sessionsToCreate.map((sessionDataNew) => sessionCreate(sessionDataNew.data)),
		]);
	},
}
));