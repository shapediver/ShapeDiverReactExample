import React, { useState } from "react";
import { AppShell, Aside, Burger, Header, MediaQuery, Navbar, useMantineTheme } from "@mantine/core";
import NavigationBar from "components/ui/NavigationBar";
import HeaderBar from "components/ui/HeaderBar";

/**
 * Function that creates the view page.
 * An AppShell is used with:
 * - the header specified as in HeaderBar
 * - the navigation (left side) specified as in NavigationBar
 *
 * @returns
 */

interface Props {
	children: React.ReactNode;
	aside?: React.ReactNode;
}

export default function ExamplePage({ children = <></>, aside = <></> }: Props) {
	const theme = useMantineTheme();
	const [opened, setOpened] = useState(false);

	return (
		<>
			<AppShell
				padding="md"
				navbarOffsetBreakpoint="sm"
				asideOffsetBreakpoint="sm"
				navbar={
					<Navbar p="md" hiddenBreakpoint="md" hidden={!opened} width={{ md: 150, lg: 200 }}>
						<NavigationBar />
					</Navbar>
				}
				header={
					<Header height={60} p="xs">
						<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%" }}>
							<MediaQuery largerThan="md" styles={{ display: "none" }}>
								<Burger
									opened={opened}
									onClick={() => setOpened((o) => !o)}
									size="sm"
									color={theme.colors.gray[6]}
								/>
							</MediaQuery>

							<HeaderBar />
						</div>
					</Header>
				}
				aside={
					<MediaQuery smallerThan="sm" styles={{ top: "calc(100% - 300px);", paddingTop: 0, paddingBottom: 0, height: 300 }}>
						<Aside p="md" hiddenBreakpoint="sm" width={{ sm: 300, lg: 300 }}>
							{ aside }
						</Aside>
					</MediaQuery>
				}
				styles={(theme) => ({
					main: { backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0] },
				})}
			>
				<MediaQuery smallerThan="sm" styles={{
					margin: "-16px!important",
					// minus two times padding (2 x 16)
					maxHeight: "calc(100% - 268px);!important"
				}}>
					{ children }
				</MediaQuery>
			</AppShell>
		</>
	);
}
