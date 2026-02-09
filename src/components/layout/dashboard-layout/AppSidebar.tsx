"use client";

import { Link, useLocation } from "@tanstack/react-router";
import { BookOpen, ChevronRight, Sparkles } from "lucide-react";
import type * as React from "react";
import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { sidebarMenus } from "@/config/nav-config";
import { cn } from "@/lib/utils";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { pathname } = useLocation();

	return (
		<Sidebar collapsible="icon" {...props} className="border-r-0 glass">
			<SidebarHeader className="h-16 flex items-center px-4 border-b border-sidebar-border/50">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							size="lg"
							className="hover:bg-transparent focus-visible:ring-0"
						>
							<div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30 text-primary-foreground transform transition-transform group-hover:scale-110">
								<BookOpen className="size-6 text-white" />
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight ml-2">
								<span className="truncate font-black text-lg tracking-tighter text-gradient">
									EduSynergy
								</span>
								<span className="truncate text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
									Admin Suite
								</span>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent className="px-2 py-4">
				<SidebarGroup>
					<SidebarGroupLabel className="px-4 text-label-caps h-auto py-2">
						Platform
					</SidebarGroupLabel>
					<SidebarMenu className="gap-1">
						{sidebarMenus.mainMenus.map((item) => {
							const isActive =
								item.items?.some(
									(subItem) =>
										subItem.url === pathname ||
										pathname.startsWith(subItem.url),
								) || item.isActive;

							return (
								<Collapsible
									key={item.title}
									open={isActive}
									className="group/collapsible"
								>
									<SidebarMenuItem>
										{item.items ? (
											<>
												<CollapsibleTrigger
													render={(props) => (
														<SidebarMenuButton
															tooltip={item.title}
															{...props}
															className={cn(
																"h-11 px-4 rounded-xl hover:bg-primary/5 hover:text-primary transition-all duration-300 group/btn",
																isActive &&
																	"bg-primary/10 text-primary font-bold",
															)}
														>
															{item.icon && (
																<item.icon className="size-5 transition-transform group-hover/btn:scale-110" />
															)}
															<span className="text-sm font-semibold tracking-tight">
																{item.title}
															</span>
															<ChevronRight className="ml-auto size-4 opacity-40 transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90 group-hover/btn:opacity-100" />
														</SidebarMenuButton>
													)}
												/>
												<CollapsibleContent>
													<SidebarMenuSub className="ml-4 pl-4 border-l-2 border-primary/10 gap-1 mt-1">
														{item.items?.map((subItem) => (
															<SidebarMenuSubItem key={subItem.title}>
																<SidebarMenuSubButton
																	render={(props) => (
																		<Link
																			to={subItem.url}
																			{...props}
																			className="h-9 px-3 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors font-medium opacity-70 hover:opacity-100"
																			activeProps={{
																				className:
																					"bg-primary/10 text-primary opacity-100 font-bold",
																			}}
																		>
																			<span className="text-xs font-medium">
																				{subItem.title}
																			</span>
																		</Link>
																	)}
																/>
															</SidebarMenuSubItem>
														))}
													</SidebarMenuSub>
												</CollapsibleContent>
											</>
										) : (
											<SidebarMenuButton
												tooltip={item.title}
												render={(props) => (
													<Link
														to={item.url}
														{...props}
														className="h-11 px-4 rounded-xl hover:bg-primary/5 hover:text-primary transition-all duration-300 group/btn"
														activeProps={{
															className:
																"bg-primary/10 text-primary opacity-100 font-bold",
														}}
													>
														{item.icon && (
															<item.icon className="size-5 transition-transform group-hover/btn:scale-110" />
														)}
														<span className="text-sm font-semibold tracking-tight">
															{item.title}
														</span>
													</Link>
												)}
											/>
										)}
									</SidebarMenuItem>
								</Collapsible>
							);
						})}
					</SidebarMenu>
				</SidebarGroup>

				{/* Pro Card Section */}
				<div className="mt-auto px-4 py-6 group-data-[collapsible=icon]:hidden">
					<div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary/10 via-primary/5 to-transparent p-4 border border-primary/10 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
						<div className="absolute top-[-10%] right-[-10%] w-20 h-20 bg-primary/10 rounded-full blur-2xl" />
						<Sparkles className="size-5 text-primary mb-3" />
						<h4 className="font-(--font-bold) text-sm tracking-tight mb-1">
							Upgrade to Pro
						</h4>
						<p className="text-label-caps text-muted-foreground/50! mb-4 tracking-normal">
							Unlock advanced features
						</p>
						<Button
							size="sm"
							className="w-full h-8 rounded-lg font-bold text-[11px] shadow-sm transform transition-transform hover:scale-[1.02]"
						>
							Get Started
						</Button>
					</div>
				</div>

				{/* <SidebarGroup className="group-data-[collapsible=icon]:hidden pt-0">
					<SidebarGroupLabel className="px-4 text-label-caps text-muted-foreground/40 mb-2">
						System
					</SidebarGroupLabel>
					<SidebarMenu className="gap-1">
						{data.secondary.map((item) => (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton
									size="sm"
									className="h-10 px-4 rounded-xl hover:bg-muted/50 transition-all font-medium"
									render={(props) => (
										<Link to={item.url} {...props}>
											<item.icon className="size-4 opacity-60" />
											<span className="text-xs">{item.title}</span>
										</Link>
									)}
								/>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup> */}
			</SidebarContent>

			<SidebarRail />
		</Sidebar>
	);
}
