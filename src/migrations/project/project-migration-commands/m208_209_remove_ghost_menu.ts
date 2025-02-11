import { rtp, RT, RecordFactory } from "../../../r/R";
import { IOrder } from "../../IOrder";
import { ProjectFactory } from "../../../r/recordFactories";

class Migration implements IOrder {
  execute (projectJson: any) {
    return migrateProject(projectJson);
  }
}

/**
 * Menu items that don't point to any valid scene should be deleted
 */
const migrateProject = (json: any) => {
  const pf = new ProjectFactory(json);
  const menuEntries = pf.getRecordEntries(RT.menu);
  const existingSceneIds = pf.getRecordIds(RT.scene);
  for(const [mId, m] of menuEntries) {
    const menuF = new RecordFactory(m);
    
    const linkedSceneId = menuF.get(rtp.menu.menu_scene_id) as number;
    //If linked scene id is undefined or doesn't exist, delete this menu entry
    if(linkedSceneId === undefined || !(existingSceneIds.includes(linkedSceneId))) {
      pf.deleteRecord(mId, RT.menu);
    }
  }
  pf.set(rtp.project.version, 209);
  return json;
}

const migration = new Migration();
export default migration;
