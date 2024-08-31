export class Breadcrumb {
  constructor(
    public label: string,
    public link: string, ) {
  }
}

export class HomeBreadcrumb extends Breadcrumb {
  constructor() {
    super( 'Dashboard', '/' );
  }
}
