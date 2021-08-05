export function getKeyPath(node: any): any {
  if (!node.parent) {
    return ['root'];
  }

  return [(node.data && node.data.id) || node.id].concat(
    getKeyPath(node.parent)
  );
}

export function updateData(data: any, keyPath: any): any {
  if (data.children) {
    data.children.map((child: any) => updateData(child, keyPath));
  }

  data.style = {
    ...data.style,
    fillOpacity: keyPath && !keyPath[data.id] ? 0.2 : 1
  };

  return data;
}
