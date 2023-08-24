import { RT, createRecord, en, r, rn, rtp } from "../../../r";
import { VarValue } from "../../../r/definitions/variables";
import { IOrder } from "../../IOrder";

class Migration implements IOrder {
  execute (projectJson: any) {
    return migrateProject(projectJson);
  }
}

const migrateProject = (json: any) => {
  const projectF = r.project(json);
  const scenes = projectF.getRecordEntries(RT.scene);

  for (const [ _sceneId, scene ] of  scenes) {
    const sceneF = r.scene(scene);
    const thenActionEntries = sceneF.getDeepRecordEntries(RT.then_action);
    const filteredTAs = thenActionEntries.filter(([ _taId, ta ]) => ta.props.action === rn.RuleAction.speak);

    for (const [ _ftaId, fta ] of filteredTAs) {
      if (fta.props.ta_co_type === en.ElementType.character) {
        const associatedCharacterElement = fta.props.ta_co_id  as number;
        const speakingText = (fta.props.ta_properties as VarValue[])[0];
        const characterElement = sceneF.getDeepRecord(associatedCharacterElement);
        
        if (characterElement) {
          const elementF = r.element(characterElement);
          const item = createRecord(RT.item);
          item.props.item_text = speakingText;
          const idAndRecord = elementF.addRecord({ record: item });

          fta.props.ta_properties = [ idAndRecord?.id ];
        }
      }
    }
  }

  projectF.set(rtp.project.version, 210);
  return json;
}

const migration = new Migration();
export default migration;
