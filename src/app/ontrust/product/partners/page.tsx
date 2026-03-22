import { PageHeader } from "@/components/layout/page-header";

export default function PartnersManagementPage() {
  return (
    <>
      <PageHeader
        title="협력사관리"
        description="협력사 데이터 연동 및 관리를 수행합니다."
      />
      <div className="p-6">
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">협력사관리</h3>
          <p className="text-sm text-gray-500 mb-4">
            협력사 데이터 연동 관련
          </p>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
            피처링 개발 범위
          </span>
        </div>
      </div>
    </>
  );
}
