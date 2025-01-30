import { SkillField } from "@/app/lib/definitions";
import {
    // CheckIcon,
    // ClockIcon,
    // CurrencyDollarIcon,
    UserCircleIcon,
} from "@heroicons/react/24/outline";
import { UserState } from "@/app/lib/actions";

export default function Skill({ skills, state }: { skills: SkillField[], state: UserState }) {
    return (
        <div className="mb-4 flex space-x-4">

            {/* Start Skill */}
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
            {/* End Skill */}

        </div>
    );
}