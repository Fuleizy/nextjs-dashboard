'use client';

import { SkillField } from "@/app/lib/definitions";
import Link from "next/link";
import {
  // CheckIcon,
  // ClockIcon,
  // CurrencyDollarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/button";
import { createUser, UserState } from "@/app/lib/actions";
import { useActionState } from 'react';
import type { User } from '@/app/lib/definitions';
import Skill from "@/app/ui/profile/skills";

export default function Form({ skills, user }: { skills: SkillField[], user: User | undefined }) {
  const initialState: UserState = { message: null, errors: {} };
  const [state, formAction] = useActionState(createUser, initialState);
  // console.log(state);
  return (
    <form action={formAction}>
      <div
        className="rounded-md bg-gray-50 p-4 md:p-6"
        aria-describedby="form-error"
      >
        {/* User name */}
        <div className="mb-4">
          <label htmlFor="username" className="mb-2 block text-sm font-medium">
            Username
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                defaultValue={user?.name} // Prefill with username
                readOnly
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="username-error"
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>
          <div id="username-error" aria-live="polite" aria-atomic="true">
            {state.errors?.username &&
              state.errors.username.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Birthday */}
        <div className="mb-4">
          <label htmlFor="birthday" className="mb-2 block text-sm font-medium">
            Birthday
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="birthday"
                name="birthday"
                type="date"
                placeholder="Enter your birthday"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="birthday-error"
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>
          <div id="birthday-error" aria-live="polite" aria-atomic="true">
            {state.errors?.birthday &&
              state.errors.birthday.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>


        {/* Customer Name */}
        {/* <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Choose customer
          </label>
          <div className="relative">
            <select
              id="customer"
              name="customerId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="customer-error"
            >
              <option value="" disabled>
                Select a customer
              </option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="customer-error" aria-live="polite" aria-atomic="true">
            {state.errors?.customerId &&
              state.errors.customerId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div> */}

        {/* Invoice Amount */}
        {/* <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Choose an amount
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="Enter USD amount"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="amount-error"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div id="amount-error" aria-live="polite" aria-atomic="true">
            {state.errors?.amount &&
              state.errors.amount.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div> */}

        {/* Invoice Status */}
        {/* <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Set the invoice status
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  aria-describedby="status-error"
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Pending <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="paid"
                  name="status"
                  type="radio"
                  value="paid"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="paid"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Paid <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
          <div id="status-error" aria-live="polite" aria-atomic="true">
            {state.errors?.status &&
              state.errors.status.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </fieldset>
        <div id="form-error" aria-live="polite" aria-atomic="true">
          {state.message && (
            <p className="mt-2 text-sm text-red-500">
              {state.message}
            </p>
          )}
        </div> */}

      </div>
      <div
        className="mt-4 rounded-md bg-gray-50 p-4 md:p-6"
        aria-describedby="form-error"
      >
        <h4 className="mb-4 text-lg font-medium">Skills I want to learn</h4>

        {/* Start Skill */}
        {/* <div className="mb-4 flex space-x-4">       
          <div className="w-3/4">
            <label htmlFor="skill" className="mb-2 block text-sm font-medium">
              Skill
            </label>
            <div className="relative">
              <select
                id="skill"
                name="skillId"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue=""
                aria-describedby="skill-error"
              >
                <option value="" disabled>
                  Select a skill
                </option>
                {skills.map((skill) => (
                  <option key={skill.id} value={skill.id}>
                    {skill.name}
                  </option>
                ))}
              </select>
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="skill-error" aria-live="polite" aria-atomic="true">
              {state.errors?.skillId &&
                state.errors.skillId.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          <div className="w-1/4">
            <label htmlFor="level" className="mb-2 block text-sm font-medium">
              Level
            </label>
            <div className="relative">
              <select
                id="level"
                name="level"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-1 text-sm outline-2 placeholder:text-gray-500"
                defaultValue=""
                aria-describedby="level-error"
              >
                <option value="" disabled>
                  Select a level
                </option>
                <option value="Beginner">
                  Beginner
                </option>
                <option value="Intermediate">
                  Intermediate
                </option>
                <option value="Expert">
                  Expert
                </option>

              </select>

            </div>
            <div id="level-error" aria-live="polite" aria-atomic="true">
              {state.errors?.level &&
                state.errors.level.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div> */}
        {/* End Skill */}

        <Skill skills={skills} state={state} />
        <Skill skills={skills} state={state} />
        <Skill skills={skills} state={state} />
      </div>

      <div
        className="mt-4 rounded-md bg-gray-50 p-4 md:p-6"
        aria-describedby="form-error"
      >
        <h4 className="mb-4 text-lg font-medium">Skills I want to teach</h4>
        <Skill skills={skills} state={state} />
        <Skill skills={skills} state={state} />
        <Skill skills={skills} state={state} />
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href={`/profile/${user?.email}`} // Redirect to user profile
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Save</Button>
      </div>
    </form >
  );
}
