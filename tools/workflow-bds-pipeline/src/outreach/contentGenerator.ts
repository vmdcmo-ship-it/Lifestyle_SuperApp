import type { Advisor } from '../advisor/advisor.js';
import type { Persona } from '../advisor/types.js';
import type { OutreachTask } from './types.js';

function pick<T>(arr: T[]): T {
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx] ?? arr[0] as T;
}

function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? '');
}

/**
 * Sinh nội dung cho từng loại hành động:
 * - add_friend: kịch bản mở đầu của persona (cá nhân hóa theo dự án).
 * - message: tin giới thiệu grounded KB (Advisor.composeOutreach).
 * - add_group: lời mời vào nhóm phù hợp.
 */
export class ContentGenerator {
  private readonly persona: Persona;

  private readonly advisor: Advisor;

  constructor(persona: Persona, advisor: Advisor) {
    this.persona = persona;
    this.advisor = advisor;
  }

  async generate(task: OutreachTask): Promise<string> {
    const vars = { name: this.persona.name, project: task.projectName, group: task.groupName };
    if (task.action === 'add_friend') {
      return fill(pick(this.persona.scripts.opening), vars);
    }
    if (task.action === 'add_group') {
      return fill(
        `Dạ ${this.persona.address.customer} ơi, em có nhóm "{group}" chuyên thông tin về {project}, nhiều ưu đãi và cập nhật mới. Em mời ${this.persona.address.customer} tham gia để tiện theo dõi nha?`,
        vars,
      );
    }
    const composed = await this.advisor.composeOutreach(task.projectId, task.leadNeed, task.leadName);
    return composed ?? this.persona.no_data_reply;
  }
}
