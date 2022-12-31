import { Profile } from "~/types";

export default class ProfileManager {
  private static getProfileByIndex(index: number): Profile | null {
    const data = localStorage.getItem("profiles");
    if (data == null) return null;

    const profiles = JSON.parse(data) as Profile[];
    if (profiles.length === 0 || profiles[index] == null) return null;

    return profiles[index];
  }

  private static getProfileById(id: string): Profile | undefined {
    const data = localStorage.getItem("profiles");
    if (data == null) return;

    const profile = JSON.parse(data) as Profile;
    if (profile[id] == null) return;

    return profile[id];
  }

  private static saveProfile(id: string | undefined, profile: Profile): void | string {
    if (!id) id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const data = localStorage.getItem("profiles");
    if (data == null) {
      localStorage.setItem("profiles", JSON.stringify([profile]));
    } else {
      const profiles = JSON.parse(data) as Profile[];

      profiles.push(profile);
      localStorage.setItem("profiles", JSON.stringify(profiles));
    }

    if (!id) return id;
  }

  public static getAll(): Profile[] {
    const profiles = localStorage.getItem("profiles");

    if (profiles == null) return [];
    return JSON.parse(profiles) as Profile[];
  }

  public static getPrimedProfile(): Profile | undefined {
    const profile = localStorage.getItem("primed_profile");
    if (profile == null) return;

    return JSON.parse(profile) as Profile;
  }

  public static load(id: string | undefined): Profile | undefined {
    if (!id) {
      // Try load first save item

      const profile = this.getProfileByIndex(0);
      if (!profile) return;

      return profile;
    } else {
      return this.getProfileById(id);
    }
  }

  public static save(id: string, profile: Profile) {
    this.saveProfile(id, profile);
  }
}

export 
const id = async () => {
  if (Object.prototype.hasOwnProperty.call(self, "crypto")) {
    let buffer = new Uint8Array(16);
    crypto.getRandomValues(buffer);
    return [...buffer]
      .map(x => x.toString(16).padStart(2, "0"))
      .join("");
  } else {
    return (await import("crypto")).randomBytes(16).toString("hex");
  }
};
