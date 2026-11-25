/** @format */

"use client";

import React from "react";

interface HoneypotFieldProps {
	id: string;
	value: string;
	onChange: (value: string) => void;
}

/**
 * Visually hidden off-screen honeypot field designed to trap automated bots
 * while minimizing false positives from browser profile/password autofill.
 */
export default function HoneypotField({ id, value, onChange }: HoneypotFieldProps) {
	return (
		<div
			aria-hidden="true"
			style={{
				position: "absolute",
				left: "-9999px",
				top: "auto",
				width: "1px",
				height: "1px",
				overflow: "hidden",
				opacity: 0,
				pointerEvents: "none",
			}}>
			<label htmlFor={id}>Do not fill this field</label>
			<input
				id={id}
				name="website_hp"
				type="text"
				tabIndex={-1}
				autoComplete="new-password"
				data-lpignore="true"
				data-1p-ignore="true"
				data-bwignore="true"
				value={value}
				onChange={(e) => onChange(e.target.value)}
			/>
		</div>
	);
}
