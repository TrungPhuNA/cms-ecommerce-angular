<div class="aside-menu flex-column-fluid">
    <!--begin::Aside Menu-->
    <div class="hover-scroll-overlay-y my-5 my-lg-5" id="kt_aside_menu_wrapper" data-kt-scroll="true"
         data-kt-scroll-activate="{default: false, lg: true}" data-kt-scroll-height="auto"
         data-kt-scroll-dependencies="#kt_aside_logo, #kt_aside_footer"
         data-kt-scroll-wrappers="#kt_aside_menu" data-kt-scroll-offset="0">
        <!--begin::Menu-->
        <div class="menu menu-column menu-title-gray-800 menu-state-title-primary menu-state-icon-primary menu-state-bullet-primary menu-arrow-gray-500"
             id="#kt_aside_menu" data-kt-menu="true" data-kt-menu-expand="false">
            <div class="menu-item">
                <a class="menu-link"
                   href="/admin"
                   title="Dashboard"
                   data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-dismiss="click"
                   data-bs-placement="right">
                      <span class="menu-icon">
                            <!--begin::Svg Icon | path: icons/duotune/general/gen025.svg-->
                            <span class="svg-icon svg-icon-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                     fill="none">
                                    <rect x="2" y="2" width="9" height="9" rx="2" fill="currentColor"></rect>
                                    <rect opacity="0.3" x="13" y="2" width="9" height="9" rx="2"
                                          fill="currentColor"></rect>
                                    <rect opacity="0.3" x="13" y="13" width="9" height="9" rx="2"
                                          fill="currentColor"></rect>
                                    <rect opacity="0.3" x="2" y="13" width="9" height="9" rx="2"
                                          fill="currentColor"></rect>
                                </svg>
                            </span>
                          <!--end::Svg Icon-->
                        </span>
                    <span class="menu-title">Dashboards</span>
                </a>
            </div>

            <div data-kt-menu-trigger="click" class="menu-item here show menu-accordion">
                <span class="menu-link">
                    <span class="menu-icon">
                        <!--begin::Svg Icon | path: icons/duotune/ecommerce/ecm001.svg-->
                        <span class="svg-icon svg-icon-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                 viewBox="0 0 24 24" fill="none">
                                <path opacity="0.3"
                                      d="M18.041 22.041C18.5932 22.041 19.041 21.5932 19.041 21.041C19.041 20.4887 18.5932 20.041 18.041 20.041C17.4887 20.041 17.041 20.4887 17.041 21.041C17.041 21.5932 17.4887 22.041 18.041 22.041Z"
                                      fill="currentColor"></path>
                                <path opacity="0.3"
                                      d="M6.04095 22.041C6.59324 22.041 7.04095 21.5932 7.04095 21.041C7.04095 20.4887 6.59324 20.041 6.04095 20.041C5.48867 20.041 5.04095 20.4887 5.04095 21.041C5.04095 21.5932 5.48867 22.041 6.04095 22.041Z"
                                      fill="currentColor"></path>
                                <path opacity="0.3"
                                      d="M7.04095 16.041L19.1409 15.1409C19.7409 15.1409 20.141 14.7409 20.341 14.1409L21.7409 8.34094C21.9409 7.64094 21.4409 7.04095 20.7409 7.04095H5.44095L7.04095 16.041Z"
                                      fill="currentColor"></path>
                                <path d="M19.041 20.041H5.04096C4.74096 20.041 4.34095 19.841 4.14095 19.541C3.94095 19.241 3.94095 18.841 4.14095 18.541L6.04096 14.841L4.14095 4.64095L2.54096 3.84096C2.04096 3.64096 1.84095 3.04097 2.14095 2.54097C2.34095 2.04097 2.94096 1.84095 3.44096 2.14095L5.44096 3.14095C5.74096 3.24095 5.94096 3.54096 5.94096 3.84096L7.94096 14.841C7.94096 15.041 7.94095 15.241 7.84095 15.441L6.54096 18.041H19.041C19.641 18.041 20.041 18.441 20.041 19.041C20.041 19.641 19.641 20.041 19.041 20.041Z"
                                      fill="currentColor"></path>
                            </svg>
                        </span>
                        <!--end::Svg Icon-->
                    </span>
                    <span class="menu-title">eCommerce</span>
                    <span class="menu-arrow"></span>
                </span>
                <div class="menu-sub menu-sub-accordion">
                    <div class="menu-item">
                        <a class="menu-link" href="{{ route("admin.attributes.index") }}">
                            <span class="menu-bullet">
                                <span class="bullet bullet-dot"></span>
                            </span>
                            <span class="menu-title">Product Attribute</span>
                        </a>
                    </div>
                    <div class="menu-item">
                        <a class="menu-link" href="">
                            <span class="menu-bullet">
                                <span class="bullet bullet-dot"></span>
                            </span>
                            <span class="menu-title">Product Options</span>
                        </a>
                    </div>
                    <div class="menu-item">
                        <a class="menu-link" href="{{ route("admin.category.index") }}">
                            <span class="menu-bullet">
                                <span class="bullet bullet-dot"></span>
                            </span>
                            <span class="menu-title">Category</span>
                        </a>
                    </div>
                    <div class="menu-item">
                        <a class="menu-link" href="">
                            <span class="menu-bullet">
                                <span class="bullet bullet-dot"></span>
                            </span>
                            <span class="menu-title">Products</span>
                        </a>
                    </div>
                    <div class="menu-item">
                        <a class="menu-link" href="">
                            <span class="menu-bullet">
                                <span class="bullet bullet-dot"></span>
                            </span>
                            <span class="menu-title">Reviews</span>
                        </a>
                    </div>
                </div>
            </div>
            <div class="menu-item">
                <a class="menu-link"
                   href="https://preview.keenthemes.com/metronic8/demo1/layout-builder.html"
                   title="Build your layout and export HTML for server side integration"
                   data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-dismiss="click"
                   data-bs-placement="right">
                                        <span class="menu-icon">
                                            <span class="svg-icon svg-icon-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none">
                                            <rect x="2" y="2" width="9" height="9" rx="2" fill="currentColor"></rect>
                                            <rect opacity="0.3" x="13" y="2" width="9" height="9" rx="2"
                                                  fill="currentColor"></rect>
                                            <rect opacity="0.3" x="13" y="13" width="9" height="9" rx="2"
                                                  fill="currentColor"></rect>
                                            <rect opacity="0.3" x="2" y="13" width="9" height="9" rx="2"
                                                  fill="currentColor"></rect>
                                        </svg>
                                            </span>
                                            <!--end::Svg Icon-->
                                        </span>
                    <span class="menu-title">Layout Builder</span>
                </a>
            </div>
        </div>
        <!--end::Menu-->
    </div>
    <!--end::Aside Menu-->
</div>