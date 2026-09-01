/**
 * Observable Event Bus Pipeline (Observer Design Pattern)
 *
 * Provides a decoupled publish-subscribe event engine for domain events:
 * 1. ProjectSubject: Subject that manages observers and dispatches domain events
 * 2. Observer Interface: Subscriber interface for handling events asynchronously
 * 3. Built-in Observers: Audit Log Observer, Cache Eviction Observer, Email Notification Observer
 *
 * @module ProjectSubject
 * @format
 */

import { CacheService } from "@/lib/cache/CacheService";
import { sendProjectStatusEmail } from "@/lib/email";

export type EventType =
	| "PROJECT_CREATED"
	| "PROJECT_UPDATED"
	| "PROJECT_PUBLISHED"
	| "USER_REGISTERED"
	| "SUBSCRIPTION_UPDATED";

export interface ProjectEvent<T = any> {
	id: string;
	type: EventType;
	timestamp: string;
	tenantId: string;
	payload: T;
}

export interface Observer {
	name: string;
	update(event: ProjectEvent): Promise<void> | void;
}

/**
 * Subject implementation managing domain observers and event notifications.
 */
export class ProjectSubject {
	private static instance: ProjectSubject;
	private observers: Observer[] = [];

	private constructor() {
		// Register default core system observers
		this.subscribe(new AuditLogObserver());
		this.subscribe(new CacheEvictionObserver());
		this.subscribe(new EmailNotificationObserver());
	}

	/**
	 * Returns singleton instance of ProjectSubject.
	 */
	public static getInstance(): ProjectSubject {
		if (!ProjectSubject.instance) {
			ProjectSubject.instance = new ProjectSubject();
		}
		return ProjectSubject.instance;
	}

	/**
	 * Subscribes a new observer to the event bus.
	 */
	public subscribe(observer: Observer): void {
		const exists = this.observers.some((o) => o.name === observer.name);
		if (!exists) {
			this.observers.push(observer);
		}
	}

	/**
	 * Unsubscribes an observer from the event bus.
	 */
	public unsubscribe(observerName: string): void {
		this.observers = this.observers.filter((o) => o.name !== observerName);
	}

	/**
	 * Dispatches an event asynchronously to all subscribed observers.
	 */
	public async notify(event: ProjectEvent): Promise<void> {
		const dispatches = this.observers.map(async (observer) => {
			try {
				await observer.update(event);
			} catch (err) {
				console.error(`[EVENT_OBSERVER_ERROR:${observer.name}]`, err);
			}
		});

		await Promise.allSettled(dispatches);
	}
}

/**
 * Core Observer 1: Logs all domain events for auditing
 */
export class AuditLogObserver implements Observer {
	public name = "AuditLogObserver";

	public update(event: ProjectEvent): void {
		console.log(
			`[AUDIT_LOG] [${event.timestamp}] [${event.type}] Tenant: ${event.tenantId} | Event ID: ${event.id}`,
		);
	}
}

/**
 * Core Observer 2: Automatically evicts stale L1/L2 caches when project events occur
 */
export class CacheEvictionObserver implements Observer {
	public name = "CacheEvictionObserver";

	public async update(event: ProjectEvent): Promise<void> {
		if (
			event.type === "PROJECT_CREATED" ||
			event.type === "PROJECT_UPDATED" ||
			event.type === "PROJECT_PUBLISHED"
		) {
			const cacheKey = `tenant:projects:${event.tenantId}`;
			await CacheService.invalidate(cacheKey);
			console.log(`[CACHE_EVICTED] Purged cache key: ${cacheKey}`);
		}
	}
}

/**
 * Core Observer 3: Automatically dispatches transactional email notices
 */
export class EmailNotificationObserver implements Observer {
	public name = "EmailNotificationObserver";

	public async update(event: ProjectEvent): Promise<void> {
		try {
			if (event.type === "PROJECT_CREATED" && event.payload) {
				const project = event.payload;
				console.log(`[EMAIL_EVENT] Queued welcome status notice for project: ${project.name}`);
			} else if (
				(event.type === "PROJECT_UPDATED" || event.type === "PROJECT_PUBLISHED") &&
				event.payload?.toEmail
			) {
				await sendProjectStatusEmail(
					event.payload.toEmail,
					event.payload.userName || "Subscriber",
					event.payload.projectName || "Kiosk Website",
					event.payload.status || (event.type === "PROJECT_PUBLISHED" ? "PUBLISHED" : "UPDATED"),
					event.payload.publishedUrl,
				);
				console.log(
					`[EMAIL_EVENT] Dispatched project status update email to ${event.payload.toEmail}`,
				);
			}
		} catch (err) {
			console.error("[EMAIL_OBSERVER_ERROR]", err);
		}
	}
}

