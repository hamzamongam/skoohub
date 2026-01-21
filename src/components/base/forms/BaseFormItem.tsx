import React, { cloneElement, type ReactElement } from "react";
import {
	type Control,
	type FieldValues,
	type Path,
	type RegisterOptions,
	useController,
	useFormContext,
} from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";

interface FormItemProps<TFieldValues extends FieldValues> {
	control?: Control<TFieldValues>;
	className?: string;
	label?: string;
	name: Path<TFieldValues>;
	rules?: RegisterOptions<TFieldValues>;
	children: ReactElement;
	required?: boolean;
	getValueFromEvent?: (...e: any) => any;
}

export default function FormItem<TFieldValues extends FieldValues>({
	label,
	name,
	rules,
	children,
	className,
	required,
	getValueFromEvent,
}: FormItemProps<TFieldValues>) {
	const { control } = useFormContext<TFieldValues>();

	const {
		field: { onChange, onBlur, value, ref },
		fieldState: { error, invalid },
	} = useController({
		name,
		control,
		rules,
	});

	const childProps = {
		onChange: (...e: any) => {
			if (getValueFromEvent) {
				onChange(getValueFromEvent?.(...(e as any)));
			} else {
				onChange(...e);
			}
		},
		onBlur,
		value,
		name,
		ref,
		id: name,
		"aria-invalid": invalid,
		"aria-describedby": error ? `${name}-error` : undefined,
	};

	const child = React.Children.only(children);

	return (
		<Field data-invalid={invalid} className={cn(className)}>
			<FieldLabel htmlFor={name}>
				{label}
				{required && <span className="text-red-600">*</span>}
			</FieldLabel>
			{/* {label && !hideLabel && (
          <BaseFormLabel classNames={{ label: classNames?.label, wrapper: classNames?.labelWrapper }} label={label} name={name} action={action} required={!!rules?.required || required} />
          // <div className='flex justify-between'>
          //   <label
          //     className={classMerge('block mb-1 text-sm', classNames?.labelWrapper)}
          //     htmlFor={name}
          //   >
          //     <span className={classMerge('font-medium', classNames?.label)}>
          //       {label}
          //       {(rules?.required || required) && <span className="text-red-600">*</span>}
          //     </span>
          //   </label>
          //   {action && <div>{action}</div>}
          // </div>
        )} */}
			{cloneElement(child, childProps as React.HTMLAttributes<HTMLElement>)}
			{error && <FieldError errors={[error]} />}
		</Field>
	);
}
