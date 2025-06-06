export const getStorageObject = (name: string) => {
  if (typeof localStorage === "undefined") return;

  const content = localStorage.getItem(name);

  if (content) {
    return JSON.parse(content);
  }
};

export const setStorageObject = (name: string, content: Object) => {
  if (typeof localStorage === "undefined") return;

  localStorage.setItem(name, JSON.stringify(content));
};
